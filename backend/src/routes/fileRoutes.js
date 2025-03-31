const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const router = express.Router();

// Configurar multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Procesar el archivo cargado
  const file = req.file;
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    // Aquí puedes manejar el contenido del archivo Excel
    console.log(workbook);
    res.status(200).send("Archivo Excel recibido y procesado.");
  } else if (file.mimetype === "text/csv") {
    // Procesar archivo CSV
    console.log(file.buffer.toString());
    res.status(200).send("Archivo CSV recibido y procesado.");
  } else {
    res.status(400).send("Archivo no compatible. Solo se permiten CSV y XLSX.");
  }
});

module.exports = router;
