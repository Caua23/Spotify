const db = require('./db')

const Img = db.sequelize.define('Img', {
    Name: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },

    Size: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
    },

    Key: {
        type: db.Sequelize.STRING,
        allowNull: false,

    },
    Url: {
        type: db.Sequelize.STRING
    },
})
//Img.sync({force: true})
module.exports = Img