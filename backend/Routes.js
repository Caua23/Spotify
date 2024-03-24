const { json } = require('body-parser');

module.exports = function Router(io) {
    const usuarios = require('./models/User.js');

    const music = require('./models/Music.js')
    const db = require('./models/db.js')
    const Img = require('./models/Img.js')

    //Rotas
    const routes = require('express').Router();
    //outros
    const path = require('path')
    const jwt = require('jsonwebtoken');
    //const ImgUser = "../Web/src/Assets/user_updated.png"



    routes.get('/data/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const dataEmail = await db.sequelize.query('SELECT * FROM usuarios WHERE ID = ?', { replacements: [id], type: db.sequelize.QueryTypes.SELECT });
            const profilePicture = await db.sequelize.query('SELECT * FROM imgs WHERE ID = ?', { replacements: [id], type: db.sequelize.QueryTypes.SELECT})
            
            if (dataEmail.length === 0 || profilePicture.length === 0) {
                return res.status(404).json('Usuário não encontrado!');
            }
            const userData = {
                dataEmail: dataEmail,
                ImgProfile: profilePicture
            }
            console.log(json(userData))
            return res.json(userData);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return res.status(500).json('Erro ao buscar dados do usuário');
        }
    });

    routes.get('/account/overview', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'account.html'))
    })

    const multer = require('multer')
    const multerConfig = require('./src/config/multer/multer.js')
    routes.post('/account/overview', multer(multerConfig).single("file"), async (req, res) => {
        const { originalname: Name, size: Size, filename: Key } = req.file
        const { UpdateEmail, UpdatePass } = req.body
        console.log(req.file);
        console.log(req.body);
        const post = await Img.create({
            Name,
            Size,
            Key,
            Url: '',
        })
            .catch((erro) => {
                return erro
            })

        const Update = await usuarios.update(
            {
                emails: UpdateEmail, Password: UpdatePass
            },
            {
                where: {
                    id: 1,
                },
            }
        )
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
        return res.json(post);
    })

    routes.post('/intl-sucess', async (req, res) => {
        const { emailCadastro, passCadastro: senhaCadastro } = req.body
        const usuarioExistente = await usuarios.findOne({ where: { emails: emailCadastro } })
        if (usuarioExistente) {

            io.emit('evento', { message: 'Evento emitido do servidor' });

        } else {
            const newUser = await usuarios.create({
                emails: emailCadastro,
                Password: String(senhaCadastro),
                nome: 'User-' + generateName(20),

            })
                .then(() => (
                    console.log('Novo usuário criado:', emailCadastro, senhaCadastro)
                ))
            const cadastroImg = await Img.create({
                Name: 'user_updated.png',
                Size: 21956,
                Key: 'User-' + generateName(20),
                Url: '/Assets/',
            })
                .then((result) => (
                    console.log(result)
                ))
            res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'))
        }
    })
    routes.post('/login', (req, res) => {
        const { emailLogin, passwordLogin } = req.body
        if (emailLogin && passwordLogin) {
            db.sequelize.query('SELECT * FROM usuarios WHERE emails = ? AND password = ?', { replacements: [emailLogin, passwordLogin], type: db.sequelize.QueryTypes.SELECT })
                .then(results => {
                    if (results.length > 0) {
                        res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'));
                    } else {

                    }
                })
                .catch(error => {
                    console.error('Erro ao executar a consulta SQL:', error);
                    res.status(500).send('Erro interno no servidor');
                });
        } else {
            res.send('Por favor, insira e-mail e senha');
        }
    });

    // routes.get('/conta/:id/imagem', (req, res) => {
    //     const id = req.params.id
    //     const idNum = Number(id)
    //     db.sequelize.query('select imagem from conta where id = ? ', { replacements: [idNum], type: db.sequelize.QueryTypes.SELECT }, (err, results) => {
    //         if (err) {
    //             console.error('Erro ao recuperar imagem do usuário:', err);
    //             res.status(500).send('Erro ao recuperar imagem do usuário');
    //             return;
    //         }
    //         if (results.length > 0 && results[0].imagem) {
    //             // Se houver uma imagem, envie-a para o frontend
    //             const imagem = results[0].imagem;
    //             res.writeHead(200, {
    //                 'Content-Type': 'image/png', // ajuste o tipo de conteúdo conforme necessário
    //                 'Content-Length': imagem.length
    //             });
    //             res.end(imagem);
    //         } else {
    //             // Se não houver imagem ou o usuário não for encontrado, envie uma resposta vazia
    //             res.status(404).send('Imagem não encontrada');
    //         }
    //     })
    // })


    routes.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'indexSemLogin.html'))
    })

    routes.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'Login.html'))
    })

    routes.get('/singUp', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'SingUp.html'))
    })

    routes.get('/signUp/phone', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'Login.html'))
    })
    routes.get('/intl', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'indexSemLogin.html'));
    })

    routes.get('/Sucess', (req, res) => {
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'));
    })




    function generateName(len) {
        var name = ""
        do {
            name += Math.random().toString(36).substring(2)
        } while (name.length < len)
        name = name.substr(0, len);
        return name

    }


    routes.post('/verificar-email', (req, res) => {
        const { email } = req.body;
        if (!email) {
            return false
        }
        const emailExiste = verificaExistenciaDoEmailNoBancoDeDados(email);
        res.json({ exists: emailExiste });

    })


    async function verificaExistenciaDoEmailNoBancoDeDados(email) {
        try {
            const usuario = await usuarios.findOne({ where: { emails: email } });
            // Se o usuário for encontrado, o e-mail já existe
            return !!usuario;
        } catch (error) {
            console.error('Erro durante a verificação do e-mail no banco de dados:', error);
            return false;
        }
    }




    routes.post('/gerarToken', (req, res) => {
        const userId = req.body.userId;

        const token = jwt.sign({ userId }, '5423526346421', { expiresIn: '30d' });
        res.json({ token });
    })

    const verificarToken = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.redirect('/')
        }
        jwt.verify(token, '5423526346421', (err, decoded) => {
            if (err) {
                return res.redirect('/')
            }
            req.userId = decoded.userId;
            next();
        })
    }

    routes.get('/rotaProtegida', verificarToken, (req, res) => {
        res.json({ mensagem: 'Rota protegida com sucesso!', userId: req.userId });
    });



    return routes;
};
//module.exports = routes;


