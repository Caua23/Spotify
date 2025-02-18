const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const imagesDir = path.resolve(__dirname, '..', '..', 'tmp', 'Som', 'Imgs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err);
            const fileName = `${hash.toString('hex')}-${file.originalname}`;
            cb(null, fileName);
        });
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/pjpeg',
        'image/gif',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter
});

module.exports = upload;
