// const usuarios = require('./models/User');
// const music = require('./models/Music')
// const db = require('./models/db')

//Server node [Express]
const express = require('express')
const app = express()


//Outros
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser');


//Socket
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io');
const io = new Server(server);


io.on('connection', Socket => {
    console.log('a user connected');
})


//----------------------------------------------------------//
const publicPath = path.join(__dirname, '../web/public');
app.use(express.static(publicPath));
app.use(express.json());
//app.use(session({ secret: 'Var28024535' }));

app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------\\
function serveStaticFiles(route, folder) {
    app.use(`/${route}/css`, express.static(path.join(publicPath, folder, 'css')));
    app.use(`/${route}/js`, express.static(path.join(publicPath, folder, 'js')));
}
serveStaticFiles('login', 'Login');
serveStaticFiles('signup', 'SignUp');
serveStaticFiles('index', 'index');
serveStaticFiles('acc', 'account');
serveStaticFiles('AudioInfo', 'AudioInfo');
serveStaticFiles('Audio', 'Audio');
//----------------------------------------------------------------\\
//assets
app.use('/Assets', express.static(path.join(__dirname, '../web/src/Assets')));
app.use('/Tmp', express.static(path.join(__dirname, './src/tmp/uploads')));
app.use('/Sounds', express.static(path.join(__dirname, './src/tmp/Som')));
app.use('/ImgSounds', express.static(path.join(__dirname, './src/tmp/Som/Imgs')));
//Router 
const routes = require('./Routes')(io);
app.use(routes)

module.exports = {
    io: io,
}
const port = process.env.PORT || 3001
server.listen(port, function () {
    console.log('Server esta rodando em http://localhost:' + port);
})

