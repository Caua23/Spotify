const db = require('./db')

const Music = db.sequelize.define('Music', {
    Id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    //Info do audio
    MusicName: {
        type: db.Sequelize.STRING,
        
    },

    MusicSize: {
        type: db.Sequelize.INTEGER,
        
    },

    MusicKey: {
        type: db.Sequelize.STRING,
        
    },
    MusicURL: {
        type: db.Sequelize.STRING

    },
    // Info da musica
    ImageURL: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    NameMusic: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    NameCreator: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})
//Music.sync({ force: true })
module.exports = Music
// imagem, NameMusic, NameCreator