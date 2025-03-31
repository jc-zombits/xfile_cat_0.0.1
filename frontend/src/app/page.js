"use client";
import { useState } from "react";
import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";

export default function Home() {
  const [message, setMessage] = useState("Load and read your xlsx or csv files...");
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:3001/api/files/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => setMessage("❌ Error al cargar el archivo"));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="bg-gradient-to-r from-amber-200 to-yellow-400 rounded">XFile Cat_0.0.1</h1>
        <p>{message}</p>
        <div className="upload-section">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  );
}
