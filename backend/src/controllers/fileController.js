// backend/src/controllers/fileController.js
const ExcelService = require('../services/excelService');
const path = require('path');
const fs = require('fs').promises;

exports.uploadFileToDB = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No se recibió ningún archivo');
    }

    // Usar path.join para compatibilidad multiplataforma
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    
    // Verificar que el archivo existe antes de procesar
    await fs.access(filePath);

    const result = await ExcelService.processExcelFile(filePath);
    
    // Eliminar archivo temporal
    await fs.unlink(filePath);

    return {
      success: true,
      message: 'Archivo cargado a PostgreSQL exitosamente',
      tableName: result.tableName,
      rowCount: result.rowCount,
      columns: result.columns
    };
  } catch (error) {
    console.error('Error en uploadFileToDB:', error);
    
    // Limpieza en caso de error
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      await fs.unlink(filePath).catch(e => console.error('Error al eliminar temporal:', e));
    }

    throw error; // El middleware de errores manejará la respuesta
  }
};