const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const getFileUrl = (filename, req) => {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    const baseUrl = req ? `${req.protocol}://${req.get('host')}` : (process.env.CLIENT_URL ? 'http://localhost:3000' : '');
    return `${baseUrl}/uploads/${filename}`;
};

const deleteFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (err) {
        console.warn(`[StorageService] Could not delete file: ${filePath}`, err.message);
    }
};

module.exports = {
    uploadsDir,
    getFileUrl,
    deleteFile
};
