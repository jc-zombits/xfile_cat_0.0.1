const ExcelModel = require('../models/excelModel');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs').promises;

class ExcelService {
  static async processExcelFile(filePath) {
    // Leer archivo Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

    if (!jsonData || jsonData.length === 0) {
      throw new Error('El archivo Excel está vacío o mal formateado.');
    }

    // Normalizar nombre de tabla
    const tableName = path.basename(filePath, path.extname(filePath))
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();

    // Normalizar datos
    const normalizedData = this.normalizeData(jsonData);

    // Crear tabla e insertar datos
    await ExcelModel.createTable(tableName, Object.keys(normalizedData[0]));
    await ExcelModel.bulkInsert(tableName, normalizedData);

    return {
      tableName,
      rowCount: normalizedData.length,
      columns: Object.keys(normalizedData[0])
    };
  }

  static normalizeData(data) {
    return data.map(row => {
      const normalizedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (value === undefined || value === null) {
          normalizedRow[key] = null;
        } 
        // Intentar convertir a número
        else if (!isNaN(value) && typeof value === 'string') {
          normalizedRow[key] = Number(value.replace(/,/g, ''));
        }
        // Manejar fechas
        else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
          normalizedRow[key] = new Date(value).toISOString();
        }
        // Mantener otros valores como texto
        else {
          normalizedRow[key] = String(value).trim();
        }
      }
      return normalizedRow;
    });
  }
}

module.exports = ExcelService;