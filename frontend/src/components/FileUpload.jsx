import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // 📌 Lista de archivos subidos
  const [selectedFile, setSelectedFile] = useState(null); // 📌 Archivo seleccionado de la lista

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewData([]); // Resetea la vista previa al cambiar de archivo
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

          // 📌 Guardamos el archivo en la lista si no está duplicado
          setUploadedFiles((prevFiles) => {
            const exists = prevFiles.some((f) => f.name === file.name);
            return exists ? prevFiles : [...prevFiles, file];
          });

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
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xlsm")) {
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setPreviewData(data);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleFileSelect = (e) => {
    const fileName = e.target.value;
    const selected = uploadedFiles.find((f) => f.name === fileName);
    setSelectedFile(selected);
    if (selected) {
      processFile(selected);
    }
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="file-upload-label">
        {file ? file.name : "Browse... Click in this space for select file"}
      </label>
      <input
        type="file"
        id="file-input"
        accept=".csv, .xlsx, .xlsm"
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

      {uploadedFiles.length > 0 && (
        <div className="file-selector">
          <label>Archivos Subidos:</label>
          <select onChange={handleFileSelect} value={selectedFile ? selectedFile.name : ""}>
            <option value="">Selecciona un archivo</option>
            {uploadedFiles.map((file, index) => (
              <option key={index} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="preview-table">
          <h3>Vista previa del archivo:</h3>
          <div className="table-wrapper">
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
