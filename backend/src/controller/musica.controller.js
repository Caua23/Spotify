const db = require("../../models/db");
const music = require("../../models/Music");
const { json } = require("body-parser");
class MusicaController {
  static async getMusica(req, res) {
    try {
      const musica = await db.sequelize.query("SELECT * FROM music ", {
        type: db.sequelize.QueryTypes.SELECT,
      });
      const musicas = {
        musica: musica,
      };
      console.log(json(musicas));
      return res.json(musicas);
    } catch (err) {
      console.error("Erro ao buscar dados das musicas:", err);
      return res.status(500).json("Erro ao buscar dados no banco de dados");
    }
  }

  static async createMusicAudio(req, res) {
    
    if (!req.file || !req.params.id) {
      return res.status(400).send("Nenhum arquivo foi enviado.");
    }
    try {
      const {
        originalname: MusicName,
        size: MusicSize,
        filename: MusicKey,
      } = req.file;
      const musicId = req.params.id;
      const post = await music.update(
        {
          MusicName,
          MusicSize,
          MusicKey,
          MusicURL: "/Sounds/" + MusicKey,
        },
        {
          where: { id: musicId },
        }
      );

      return res.status(201).json(post);
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).send("Erro ao salvar a música");
    }
  }

  static async createMusic(req, res) {
    
    
    if (!req.file || !req.body) {
      return res.status(400).send("Dados incompletos enviados.");
    }

    try {
      const { NameMusic, NameCreator } = req.body;
      const {
        originalname: ImageName,
        size: ImageSize,
        filename: ImageKey,
      } = req.file;
      const musicEntry = await music.create({
        ImageURL: "/ImgSounds/" + ImageKey, 
        NameMusic,
        NameCreator,
      });
      ;

      if (!musicEntry || !musicEntry.Id) {
        return res.status(500).send("Erro ao salvar a música: ID não gerado.");
      }
      
      
      return res.status(201).json({redirect: `/track/music/audio/${musicEntry.Id}`});
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).send("Erro ao salvar a música");
    }
   
  }
}

module.exports = MusicaController;
