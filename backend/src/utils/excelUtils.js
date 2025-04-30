// backend/src/utils/excelUtils.js
const xlsx = require('xlsx');
const path = require('path');

class ExcelUtils {
  static parseExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });
  }

  static generateTableName(filePath) {
    return path.basename(filePath, path.extname(filePath))
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();
  }

  static normalizeValue(value) {
    if (value === null || value === undefined) return null;
    
    // Intentar convertir números con separadores de miles
    if (typeof value === 'string') {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue.trim() !== '') {
        return parseFloat(numericValue);
      }
      
      // Manejar fechas
      if (!isNaN(Date.parse(value))) {
        return new Date(value);
      }
    }
    
    return value;
  }
}

module.exports = ExcelUtils;