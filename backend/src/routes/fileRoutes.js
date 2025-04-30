const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const fileController = require('../controllers/fileController');
const upload = require('../middleware/upload');

// Ruta para subir y guardar en PostgreSQL
router.post('/upload-to-db', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: "No se subió ningún archivo" 
      });
    }

    try {
      const result = await fileController.uploadFileToDB(req, res);
      return res.json(result);
    } catch (error) {
      console.error("Error en la ruta:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Error al procesar el archivo",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

// Ruta para procesamiento rápido (solo visualización)
router.post("/upload", upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      error: "No se subió ningún archivo" 
    });
  }

  try {
    const file = req.file;
    let processedData = null;

    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      processedData = XLSX.utils.sheet_to_json(firstSheet);
    } 
    else if (file.mimetype === "text/csv") {
      processedData = file.buffer.toString();
    } 
    else {
      return res.status(400).json({ 
        success: false,
        error: "Formato de archivo no compatible. Solo se permiten Excel (.xlsx, .xls) y CSV" 
      });
    }

    return res.status(200).json({
      success: true,
      data: processedData,
      message: "Archivo procesado correctamente",
      fileName: req.file.originalname,
      fileType: req.file.mimetype
    });

  } catch (error) {
    console.error("Error al procesar archivo:", error);
    return res.status(500).json({ 
      success: false,
      error: "Error al procesar el archivo",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;