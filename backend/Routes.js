const { json } = require("body-parser");

module.exports = function Router(io) {
  const usuarios = require("./models/User.js");
  const music = require("./models/Music.js");
  const db = require("./models/db.js");
  const Img = require("./models/Img.js");
  const bcrypt = require("bcrypt");
  //Rotas
  const routes = require("express").Router();
  //outros
  require("dotenv").config();
  const path = require("path");
  const jwt = require("jsonwebtoken");
  //const ImgUser = "../Web/src/Assets/user_updated.png"

  routes.get("/Musicas", async (req, res) => {
    try {
      const musica = await db.sequelize.query("SELECT * FROM music ", {
        type: db.sequelize.QueryTypes.SELECT,
      });
      if (musica.length === 0) {
        return res.status(404).json("nenhuma musica!");
      }
      const musicas = {
        musica: musica,
      };
      console.log(json(musicas));
      return res.json(musicas);
    } catch (err) {
      console.error("Erro ao buscar dados das musicas:", err);
      return res.status(500).json("Erro ao buscar dados no banco de dados");
    }
  });
  routes.get("/data/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const dataEmail = await db.sequelize.query(
        "SELECT * FROM usuarios WHERE ID = ?",
        { replacements: [id], type: db.sequelize.QueryTypes.SELECT }
      );
      const profilePicture = await db.sequelize.query(
        "SELECT * FROM imgs WHERE ID = ?",
        { replacements: [id], type: db.sequelize.QueryTypes.SELECT }
      );

      if (dataEmail.length === 0 || profilePicture.length === 0) {
        return res.status(404).json("Usuário não encontrado!");
      }
      const userData = {
        dataEmail: dataEmail,
        ImgProfile: profilePicture,
      };
      console.log(json(userData));
      return res.json(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return res.status(500).json("Erro ao buscar dados do usuário");
    }
  });

  routes.get("/account/overview", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "account.html"));
  });

  //------------------Baixar Arquivos ---------------------\\
  const multer = require("multer");
  const multerConfig = require("./src/config/multer/multer.js");
  const MulterMusica = require("./src/config/multer/multerMusica.js");
  const MulterMusicaImg = require("./src/config/multer/multerMusicImg.js");

  // Middleware para upload de áudio
  routes.get("/track/music/audio", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "Audio.html"));
  });
  routes.get("/track/music", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "AudioInfo.html"));
  });
  routes.post(
    "/track/music/audio",
    multer(MulterMusica).single("audiofile"),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).send("Nenhum arquivo foi enviado.");
      }

      try {
        const {
          originalname: MusicName,
          size: MusicSize,
          filename: MusicKey,
        } = req.file;
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

        res.json(post);
      } catch (error) {
        console.error("Erro:", error);
        res.status(500).send("Erro ao salvar a música");
      }
    }
  );

  // Middleware para upload de imagem da música
  routes.post(
    "/track/music",
    multer(MulterMusicaImg).single("ImgMusic"),
    async (req, res) => {
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
          ImageURL: "/ImgSounds/" + ImageKey, // Caminho da imagem
          NameMusic,
          NameCreator,
        });

        console.log("ID do novo registro:", musicEntry.Id);

        global.musicId = musicEntry.Id;

        return res.json(musicEntry);
      } catch (error) {
        console.error("Erro:", error);
        res.status(500).send("Erro ao salvar a música");
      }
      res.redirect("/track/music/audio");
    }
  );

  routes.post(
    "/account/overview",
    multer(multerConfig).single("file"),
    async (req, res) => {
      const idUpdate = 1;
      console.log(req.file);
      console.log(req.body);
      const { UpdateEmail, UpdatePass } = req.body;
      if (!req.file) {
        console.log("Nenhum arquivo foi enviado.");
      } else {
        const { originalname: Name, size: Size, filename: Key } = req.file;
        const post = await Img.update(
          {
            Name,
            Size,
            Key,
            Url: "/Tmp/" + Key,
          },
          {
            where: {
              id: idUpdate,
            },
          }
        )
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.error("Erro:", error);
          });
      }
      const Update = await usuarios
        .update(
          {
            emails: UpdateEmail,
            Password: UpdatePass,
          },
          {
            where: {
              id: idUpdate,
            },
          }
        )
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
      return res.json("Update", Update);
    }
  );

  routes.post("/intl-sucess", async (req, res) => {
    try {
      console.log("Payload recebido:", req.body);

      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const usuarioExistente = await usuarios.findOne({
        where: { emails: email },
      });
      if (usuarioExistente) {
        return res.status(400).json({ error: "E-mail já existe." });
      }

      const uniqueName = "User-" + generateName(20);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      const newUser = await usuarios.create({
        emails: email,
        Password: hashedPassword,
        nome: uniqueName,
      });

      const uniqueKey = uniqueName;

      const cadastroImg = await Img.create({
        Name: "user_updated.png",
        Size: 21956,
        Key: uniqueKey,
        Url: "/Assets/" + uniqueKey,
      });

      console.log("Imagem cadastrada:", cadastroImg);

      res.status(200).json({ redirect: "/Sucess" });
    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
      res.status(500).json({ error: "Erro no servidor." });
    }
  });

  routes.post("/login", async (req, res) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha)
        return res
          .status(400)
          .json({ error: "E-mail e senha Sao obrigatórios." });
      const usuarioExistente = await usuarios.findOne({
        where: { emails: email },
      });

      if (!usuarioExistente)
        return res.status(400).json({ error: "E-mail nao encontrado." });

      const senhaCorreta = await bcrypt.compare(
        senha,
        usuarioExistente.Password
      );
      if (senhaCorreta) {
        // const token = jwt.sign({ id: usuarioExistente.id }, process.env.jwt_secret, {
        res.status(200).json({ redirect: "/Sucess" });
      }

      res.status(400).json({ error: "Senha incorreta." });
    } catch (error) {
      console.log(error);
    }
  });
  routes.get("/", (req, res) => {
    
  });

  routes.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "Login.html"));
  });

  routes.get("/singUp", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "SingUp.html"));
  });

  routes.get("/signUp/phone", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "Login.html"));
  });
  routes.get("/intl", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../Web/", "views", "indexSemLogin.html")
    );
  });

  routes.get("/Sucess", (req, res) => {
    res.sendFile(path.join(__dirname, "../Web/", "views", "index.html"));
  });

  function generateName(len) {
    var name = "";
    do {
      name += Math.random().toString(36).substring(2);
    } while (name.length < len);
    name = name.substr(0, len);
    return name;
  }

  // const generateToken = (userId) => {
  //     const jwtSecret = process.env.jwt_secret;
  //     return jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });
  // };
  // const token = generateToken(userId);
  // routes.get('/rota_protegida', verifyToken, (req, res) => {
  //     // O usuário está autenticado e o ID do usuário está disponível em req.userId
  //     res.json({ message: 'Rota protegida', userId: req.userId });
  // });

  // const verifyToken = (req, res, next) => {
  //     const token = req.headers.authorization;
  //     if (!token) {
  //         return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  //     }
  //     jwt.verify(token, jwtSecret, (err, decoded) => {
  //         if (err) {
  //             return res.status(401).json({ message: 'Token de autenticação inválido' });
  //         }
  //         req.userId = decoded.userId; // O ID do usuário está disponível em req.userId
  //         next();
  //     });
  // };

  return routes;
};
