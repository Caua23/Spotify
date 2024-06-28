
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const uploadsDir = path.resolve(__dirname, '..', '..', 'tmp', 'Som');


module.exports = {
    dest: uploadsDir,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir)

        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (erro, hash) => {
                if (erro) cb(erro);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName)
            })
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'audio/mpeg',     // Para arquivos MP3
            'audio/wav',      // Para arquivos WAV
            'audio/aac',      // Para arquivos AAC
            'audio/ogg',      // Para arquivos OGG
            'audio/midi',     // Para arquivos MIDI
            'audio/x-midi',   // Alternativo para arquivos MIDI
            'audio/mp4',      // Para arquivos MP4 de áudio
            'audio/webm',     // Para arquivos WebM de áudio
            'audio/flac',     // Para arquivos FLAC
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'))
        }
    }
}

