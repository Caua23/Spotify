const db = require('./db')


const music = db.sequelize.define("music", {
    id: { 
        type: db.Sequelize.INTEGER, primaryKey: true
    },
    artista: {
        type: db.Sequelize.STRING(50)
    },
    sonds: {
        type: db.Sequelize.BLOB,
    },
})
//music.sync({force: true})
module.exports = music