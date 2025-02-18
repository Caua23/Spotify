const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarios = require("../../models/User.js");
const Img = require("../../models/Img.js");
const chaveSecreta = process.env.JWT_SECRET;
const { json } = require("body-parser");
const db = require("../../models/db.js");
const { where } = require("sequelize");
class UserController {
  static async home(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.redirect("/init");
      }

      const dados = await UserController.jwtAuthenticate(token);

      if (!dados) {
        return res.redirect("/auth/login");
      }
      return res.redirect("/Sucess");
    } catch (error) {
      console.log(error);
    }
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
        name: "user_updated.png",
        size: 21956,
        key: "user_updated.png",
        user: uniqueKey,
        url: "/Assets/" + "user_updated.png",
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
  
      let profilePicture = await db.sequelize.query(
        "SELECT * FROM imgs WHERE `user` = ?",
        {
          replacements: [dataEmail[0].nome],
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
  
      if (profilePicture.length === 0) {
        // Se não houver imagem cadastrada, retorna manualmente a imagem padrão sem salvar no banco
        profilePicture = [
          {
            name: "user_updated.png",
            size: 21956,
            key: "user_updated.png",
            user: dataEmail[0].nome,
            url: "/Assets/user_updated.png",
          },
        ];
      } else if (!profilePicture[0].url) {
        // Se já houver um registro, mas a URL estiver vazia, atualiza com a imagem padrão
        await db.sequelize.query(
          "UPDATE imgs SET name = ?, size = ?, `key` = ?, url = ? WHERE `user` = ?",
          {
            replacements: [
              "user_updated.png",
              21956,
              "user_updated.png",
              "/Assets/user_updated.png",
              dataEmail[0].nome,
            ],
            type: db.sequelize.QueryTypes.UPDATE,
          }
        );
  
        // Buscar novamente a imagem após a atualização
        profilePicture = await db.sequelize.query(
          "SELECT * FROM imgs WHERE `user` = ?",
          {
            replacements: [dataEmail[0].nome],
            type: db.sequelize.QueryTypes.SELECT,
          }
        );
      }
  
      const userData = {
        UserData: dataEmail,
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
    try {
      const { id, email, password } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "O ID do usuário é obrigatório." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
      }

      const { originalname: name, size: size, filename: key } = req.file;
      const userData = await db.sequelize.query(
        "SELECT nome FROM usuarios WHERE ID = ?",
        { replacements: [id], type: db.sequelize.QueryTypes.SELECT }
      );
  
      if (userData.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
  
      const user = userData[0].nome; 
  
      const post = await Img.update(
        { name, size, key, url: "/Tmp/" + key },
        { where: { user } }
      );

      if (!post[0]) {
        return res
          .status(404)
          .json({ error: "Imagem não encontrada ou não atualizada." });
      }
      
      const update = await usuarios.update(
        { email: email, Password: password },
        { where: { id } }
      );

      if (!update[0]) {
        return res
          .status(404)
          .json({ error: "Usuário não encontrado ou não atualizado." });
      }

      return res.status(200).json({
        message: "Usuário e imagem atualizados com sucesso.",
        data: { post, update },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno: " + error.message });
    }
  }

  static async protectedRoute(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];

      if (!token)
        return res.status(401).json({ error: "Token não fornecido." });
      const response = await UserController.jwtAuthenticate(token);

      if (!response) return res.status(400).json({ error: "Token invalido." });
      return res.status(200).json({ dados: response });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro interno por favor reportar esse Bug." });
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
