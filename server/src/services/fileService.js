const fs = require('fs');
const path = require('path');
const axios = require('axios');

const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.mp4', '.webm'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function safePath(filename) {
  // Strip any directory traversal and use only the basename
  const safe = path.basename(filename);
  const resolved = path.resolve(UPLOADS_DIR, safe);
  if (!resolved.startsWith(UPLOADS_DIR)) {
    throw new Error('Invalid file path');
  }
  const ext = path.extname(safe).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('Invalid file extension');
  }
  return resolved;
}

exports.saveBase64 = (base64Data, filename) => {
  const filePath = safePath(filename);
  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${path.basename(filename)}`;
};

exports.downloadAndSave = async (url, filename) => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    maxContentLength: MAX_FILE_SIZE,
  });
  const filePath = safePath(filename);
  fs.writeFileSync(filePath, response.data);
  return `/uploads/${path.basename(filename)}`;
};

exports.deleteFile = (relativePath) => {
  // Only accept paths like /uploads/filename.ext
  const filename = path.basename(relativePath);
  const filePath = path.resolve(UPLOADS_DIR, filename);
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return; // silently refuse path traversal
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
