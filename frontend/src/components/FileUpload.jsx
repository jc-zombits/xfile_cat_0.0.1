import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [sheets, setSheets] = useState([]); // Lista de hojas disponibles
  const [selectedSheet, setSelectedSheet] = useState(""); // Hoja seleccionada
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewData([]);
    setSheets([]);
    setSelectedSheet("");
  };

  const handleUpload = () => {
    if (!file) {
      alert("Por favor, seleccione un archivo.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const fakeUpload = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          processFile(file);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      if (file.name.endsWith(".csv")) {
        Papa.parse(fileContent, {
          complete: (result) => {
            setPreviewData(result.data);
          },
          header: true,
        });
      } else if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const sheetNames = workbook.SheetNames; // Lista de hojas
        setSheets(sheetNames);
        setSelectedSheet(sheetNames[0]); // Seleccionar la primera hoja por defecto
        updateSheetPreview(workbook, sheetNames[0]);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
      reader.readAsBinaryString(file);
    }
  };

  const updateSheetPreview = (workbook, sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setPreviewData(data);
  };

  const handleSheetChange = (e) => {
    const newSheet = e.target.value;
    setSelectedSheet(newSheet);

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const workbook = XLSX.read(fileContent, { type: "binary" });
      updateSheetPreview(workbook, newSheet);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="file-upload-label">
        {file ? file.name : "Browse... Click in this space for select file"}
      </label>
      <input
        type="file"
        id="file-input"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
        className="file-input"
      />
      <button onClick={handleUpload} className="upload-button">
        Cargar Archivo
      </button>

      {isUploading && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {sheets.length > 1 && (
        <div className="sheet-selector">
          <label>Selecciona una hoja:</label>
          <select value={selectedSheet} onChange={handleSheetChange}>
            {sheets.map((sheet, index) => (
              <option key={index} value={sheet}>
                {sheet}
              </option>
            ))}
          </select>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="preview-table">
          <h3>Vista previa del archivo:</h3>
          <div className="scrollable-container">
            <table>
              <thead>
                <tr>
                  {previewData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
