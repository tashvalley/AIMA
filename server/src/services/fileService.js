const fs = require('fs');
const path = require('path');
const axios = require('axios');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

exports.saveBase64 = (base64Data, filename) => {
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

exports.downloadAndSave = async (url, filename) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const filePath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, response.data);
  return `/uploads/${filename}`;
};

exports.deleteFile = (relativePath) => {
  const filePath = path.join(UPLOADS_DIR, '..', relativePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
