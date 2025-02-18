const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadsDir = path.resolve(__dirname, '..', '..', 'tmp', 'Som');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (erro, hash) => {
            if (erro) cb(erro);
            const fileName = `${hash.toString('hex')}-${file.originalname}`;
            cb(null, fileName);
        });
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'audio/mpeg',  
        'audio/wav',   
        'audio/aac',   
        'audio/ogg',   
        'audio/midi',  
        'audio/x-midi',
        'audio/mp4',   
        'audio/webm',  
        'audio/flac',  
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter
});

module.exports = upload;
