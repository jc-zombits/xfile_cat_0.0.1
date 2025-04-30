const db = require('../config/db');

class ExcelModel {
  static async createTable(tableName, columns) {
    const columnDefinitions = columns.map(col => `"${col}" TEXT`).join(', ');
    
    const query = `
      DROP TABLE IF EXISTS "${tableName}";
      CREATE TABLE "${tableName}" (
        id SERIAL PRIMARY KEY,
        ${columnDefinitions}
      );
    `;
    
    await db.query(query);
  }

  static async bulkInsert(tableName, data, batchSize = 100) {
    if (!data || data.length === 0) return;

    const columns = Object.keys(data[0]);
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const values = [];
      const placeholders = batch.map((row, rowIndex) => {
        return `(${columns.map((col, colIndex) => {
          values.push(row[col] !== undefined ? row[col] : null);
          return `$${(rowIndex * columns.length) + colIndex + 1}`;
        }).join(', ')})`;
      });

      const query = `
        INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')})
        VALUES ${placeholders.join(', ')}
      `;

      await db.query(query, values);
    }
  }
}

module.exports = ExcelModel;