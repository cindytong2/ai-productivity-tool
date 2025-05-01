import React, { useState } from "react";
import "./App.css";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setSummary("");
    setError("");
  };

  // Extract real text from PDF using pdfjs-dist
  const extractPdfText = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file provided");
      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            text += pageText + "\n";
          }
          resolve(text);
        } catch (err) {
          reject("PDF extraction failed: " + err);
        }
      };
      reader.onerror = () => reject("File reading failed");
      reader.readAsArrayBuffer(file);
    });
  };

  const handleProcessPdf = async () => {
    setError("");
    setSummary("");
    if (!pdfFile) {
      setError("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    try {
      const text = await extractPdfText(pdfFile);
      if (!text || text.trim().length === 0) {
        setError("No text could be extracted from the PDF.");
        setLoading(false);
        return;
      }
      const response = await fetch("http://localhost:8000/summarize-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
      } else if (data.error) {
        setError("Backend error: " + data.error);
      } else {
        setError("Unknown error from backend.");
      }
    } catch (err) {
      setError("Frontend error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h2>AI Productivity Tool</h2>
      <div className="upload-section">
        <b>Upload your PDF document</b>
        <button
          type="button"
          className="upload-btn"
          onClick={() => document.getElementById('pdf-upload').click()}
        >
          Choose File
        </button>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      
      {pdfFile && (
        <>
          <div className="selected-file">
            <b>Selected file:</b> {pdfFile.name}
          </div>
          <button
            className="process-btn"
            onClick={handleProcessPdf}
            disabled={loading}
          >
            {loading ? "Processing..." : "Generate Summary"}
          </button>
        </>
      )}

      {error && (
        <div className="error-message">
          <b>Error:</b> {error}
        </div>
      )}

      {summary && (
        <div className="summary-container">
          <b>AI Summary</b>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
}

export default App;