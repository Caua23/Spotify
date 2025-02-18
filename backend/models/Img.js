const db = require('./db')

const Img = db.sequelize.define('Img', {
    name: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },

    size: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },
    user:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    key: {
        type: db.Sequelize.STRING,
        allowNull: false,

    },
    url: {
        type: db.Sequelize.STRING
    },
})
//Img.sync({force: true})
module.exports = Img