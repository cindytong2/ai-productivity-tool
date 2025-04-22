import React, { useState } from "react";
import "./App.css";

function App() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  return (
    <div className="app-container">
      <h2>AI Productivity Tool</h2>
      <div className="upload-section">
        <b>Upload PDF:</b>
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
        <div className="selected-file">
          <b>Selected file:</b> {pdfFile.name}
        </div>
      )}
    </div>
  );
}

export default App;