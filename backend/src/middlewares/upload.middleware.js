const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic|mp4|mov|webm/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;

    if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format. Only images (JPG, PNG, WEBP, HEIC) and videos (MP4, MOV, WEBM) are permitted.'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter
});

module.exports = upload;
