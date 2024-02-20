const usuarios = require('./models/User');
const account = require('./models/account');
const music = require('./models/Music')
const db = require('./models/db')

//Server node [Express]
const express = require('express') 
const app = express()
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const socketIO = require('socket.io')
const http = require('http');
const { error } = require('console');
const server = http.createServer(app);
const io = socketIO(server);
const ImgUser  = "../Web/src/Assets/user_updated.png"
//API do spotify

//----------------------------------------------------------//
const publicPath = path.join(__dirname, '../web/public');
app.use(express.static(publicPath));

app.use(session({ secret: 'Var28024535' }));

app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------\\

//Styles e Scripts de cada pagina
app.use('/login/css', express.static(path.join(publicPath, 'Login', 'Login')));
app.use('/login/js', express.static(path.join(publicPath, 'Login', 'Login')));

app.use('/signup/css', express.static(path.join(publicPath, 'SignUp', 'SignUp')));
app.use('/signup/js', express.static(path.join(publicPath, 'SignUp', 'SignUp')));

app.use('/pass/css', express.static(path.join(publicPath, 'SignUp', 'pass')));
app.use('/pass/js', express.static(path.join(publicPath, 'SignUp', 'pass')));

app.use('/index/css', express.static(path.join(publicPath, 'index', 'index')));
app.use('/index/js', express.static(path.join(publicPath, 'index', 'index')));
//----------------------------------------------------------------\\

//assets
app.use('/Assets', express.static(path.join(__dirname, '../web/src/Assets')));

//----------------------------------------------------------------\\



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web/', 'views', 'indexSemLogin.html'))
})

app.get('/login', (req, res) => {

    res.sendFile(path.join(__dirname, '../Web/', 'views', 'Login.html'))
})

app.get('/singUp', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web/', 'views', 'SingUp.html'))
})

app.get('/signUp/phone', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web/', 'views', 'Login.html'))
})
app.get('/intl', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web/', 'views', 'indexSemLogin.html'));
})

app.get('/Sucess', (req, res) => {
    res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'));
})

app.get('/conta/:id/imagem', (req,res)=>{
    const id = req.params.id
    const idNum = Number(id)
    db.sequelize.query('select imagem from conta where id = ? ', {replacements: [idNum], type: db.sequelize.QueryTypes.SELECT}, (err, results)=>{
        if (err) {
            console.error('Erro ao recuperar imagem do usuário:', err);
            res.status(500).send('Erro ao recuperar imagem do usuário');
            return;
        }
        if (results.length > 0 && results[0].imagem) {
            // Se houver uma imagem, envie-a para o frontend
            const imagem = results[0].imagem;
            res.writeHead(200, {
                'Content-Type': 'image/png', // ajuste o tipo de conteúdo conforme necessário
                'Content-Length': imagem.length
            });
            res.end(imagem);
        } else {
            // Se não houver imagem ou o usuário não for encontrado, envie uma resposta vazia
            res.status(404).send('Imagem não encontrada');
        }
    })
})


app.post('/intl-sucess', async (req, res) => {
    var emailCadastro = req.body.emailCadastro
    var senhaCadastro = req.body.passCadastro

    const usuarioExistente = await usuarios.findOne({ where: { emails: emailCadastro } })
    if (usuarioExistente) {
        res.redirect('/singUp')
    } else {
        const newUser = await usuarios.create({
            emails: emailCadastro,
            Password: String(senhaCadastro),

        })
        const conta = await account.create({
            nome: 'User' + generateName(20),
            imagem: ImgUser,
        })
            .then(() => (
                console.log('Novo usuário criado:', emailCadastro, senhaCadastro)
            ))
        res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'))
    }
})


function generateName(len) {
    var name = ""
    do {
        name += Math.random().toString(36).substring(2)
    } while (name.length < len)
    name = name.substr(0, len);
    return name

}



app.post('/login', (req, res) => {
    const emailLogin = req.body.emailLogin;
    const passwordLogin = req.body.passwordLogin;

    if (emailLogin && passwordLogin) {
        db.sequelize.query('SELECT * FROM usuarios WHERE emails = ? AND password = ?', { replacements: [emailLogin, passwordLogin], type: db.sequelize.QueryTypes.SELECT })
            .then(results => {
                if (results.length > 0) {
                    res.sendFile(path.join(__dirname, '../Web/', 'views', 'index.html'));
                } else {
                    res.send('Credenciais inválidas');
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

app.get('/verificar-email', (req, res) => {
    const { email } = req.query;
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
app.post('/gerarToken', (req, res) => {
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

app.get('/rotaProtegida', verificarToken, (req, res) => {
    res.json({ mensagem: 'Rota protegida com sucesso!', userId: req.userId });
});


const port = process.env.PORT || 3001
app.listen(port, function () {
    console.log('Server esta rodando em http://localhost:' + port);
})

