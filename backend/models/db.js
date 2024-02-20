//Mysql
const Sequelize = require('sequelize')
const sequelize = new Sequelize('spotify', 'root', 'Vargas2802', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

