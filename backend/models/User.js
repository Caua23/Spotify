const db = require('./db')

const usuarios = db.sequelize.define('usuarios', {

    id: { 
        type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true
    },

    emails: {
        type: db.Sequelize.STRING,
        unique: true

    },
    
    Password: {
        type: db.Sequelize.STRING,
        allowNull: false,
    }
})

//usuarios.sync({force: true})
module.exports =  usuarios 