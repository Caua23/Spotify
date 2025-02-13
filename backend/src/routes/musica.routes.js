const express = require("express");

const router = express.Router();
const MusicaController = require("../controller/musica.controller");
const path = require("path");
const multer = require("multer");
const MulterMusica = require("../config/multer/multerMusica.js");
const MulterMusicaImg = require("../config/multer/multerMusicImg.js");

router.get("/musicas", MusicaController.getMusica);

router.post(
  "/music/audio/:id",
  multer(MulterMusica).single("audiofile"),
  MusicaController.createMusicAudio
);

router.post(
  "/music",
  multer(MulterMusicaImg).single("ImgMusic"),
  MusicaController.createMusic
);



router.get("/music/audio", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web", "views", "Audio.html"));
});
router.get("/music", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../Web", "views", "AudioInfo.html"));
});
module.exports = router;
