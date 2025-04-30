// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Asegurarse de que el directorio existe
const ensureUploadsDir = async () => {
  const uploadsPath = path.join(__dirname, '../../uploads');
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath, { recursive: true });
  }
  return uploadsPath;
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsPath = await ensureUploadsDir();
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Resto de la configuración...
module.exports = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
}).single('file');