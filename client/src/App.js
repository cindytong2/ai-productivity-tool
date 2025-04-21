import React, { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>AI Productivity Tool</h2>
      <label>
        <b>Upload PDF:</b>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "block", marginTop: 8 }}
        />
      </label>
      {pdfFile && (
        <div style={{ marginTop: 10 }}>
          <b>Selected file:</b> {pdfFile.name}
        </div>
      )}
    </div>
  );
}

export default App;