const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarios = require("../../models/User.js");
const Img = require("../../models/Img.js");
const chaveSecreta = process.env.JWT_SECRET;
const { json } = require("body-parser");
const db = require("../../models/db.js")
class UserController {
  static async home(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/init");
    }

    const dados = await UserController.jwtAuthenticate(token);

    if (!dados) {
      return res.redirect("/auth/login");
    }
    return res.redirect("/Sucess");
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const usuarioExistente = await usuarios.findOne({
        where: { email: email },
      });

      if (!usuarioExistente) {
        return res.status(400).json({ error: "E-mail não encontrado." });
      }

      const senhaCorreta = await bcrypt.compare(
        senha,
        usuarioExistente.Password
      );

      if (!senhaCorreta) {
        return res.status(400).json({ error: "Senha incorreta." });
      }

      const payload = {
        id: usuarioExistente.id,
        email: usuarioExistente.email,
        nome: usuarioExistente.nome,
      };

      const token = jwt.sign(payload, chaveSecreta, { expiresIn: "15d" });

      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.SECURE === "production",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 dias
      });

      return res.status(200).json({ redirect: "/Sucess" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  static async createUser(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const usuarioExistente = await usuarios.findOne({
        where: { email: email },
      });
      if (usuarioExistente) {
        return res.status(400).json({ error: "E-mail já existe." });
      }

      const uniqueName = "User-" + UserController.generateName(20);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      const newUser = await usuarios.create({
        email: email,
        Password: hashedPassword,
        nome: uniqueName,
      });

      const uniqueKey = uniqueName;

      const cadastroImg = await Img.create({
        Name: "user_updated.png",
        Size: 21956,
        Key: uniqueKey,
        Url: "/Assets/" + "user_updated.png",
      });

      const payload = {
        id: newUser.id,
        email: newUser.email,
        nome: newUser.nome,
      };
      const token = jwt.sign(payload, chaveSecreta, { expiresIn: "15d" });
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 dias
      });
      res.status(200).json({ redirect: "/Sucess" });
    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
      res.status(500).json({ error: "Erro no servidor." });
    }
  }
  static generateName(len) {
    var name = "";
    do {
      name += Math.random().toString(36).substring(2);
    } while (name.length < len);
    name = name.substring(0, len);
    return name;
  }

  static async getUser(req, res) {
    const id = req.params.id;
    console.log(id);
    
    try {
      const dataEmail = await db.sequelize.query(
        "SELECT * FROM usuarios WHERE ID = ?",
        { replacements: [id], type: db.sequelize.QueryTypes.SELECT }
      );
  
      if (dataEmail.length === 0) {
        return res.status(404).json("Usuário não encontrado!");
      }
  
      
      const profilePicture = await db.sequelize.query(
        "SELECT * FROM imgs WHERE `Key` = ?",
        { replacements: [dataEmail[0].nome], type: db.sequelize.QueryTypes.SELECT }
      );
      
  
      if (profilePicture.length === 0) {
        return res.status(404).json("Imagem de perfil não encontrada!");
      }
  
      const userData = {
        dataEmail: dataEmail,
        ImgProfile: profilePicture,
      };
  
      console.log(JSON.stringify(userData));
      return res.json(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return res.status(500).json("Erro ao buscar dados do usuário");
    }
  }
  
  static async updateUser(req, res) {
    console.log(req.file);
    console.log(req.body);
    const { idUpdate, UpdateEmail, UpdatePass } = req.body;
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
          email: UpdateEmail,
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

  static async protectedRoute(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];

      if (!token)
        return res.status(401).json({ error: "Token não fornecido." });
      const response = await UserController.jwtAuthenticate(token);

      if(!response) return res.status(400).json({ error: "Token invalido." });
      return res.status(200).json({dados: response})
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro interno por favor reportar esse Bug." });
    }
  }

  static async jwtAuthenticate(token) {
    try {
      if (!token) return false;
      const dadosDecodificados = jwt.verify(token, chaveSecreta);
      return dadosDecodificados;
    } catch (err) {
      return false;
    }
  }
}

module.exports = UserController;
