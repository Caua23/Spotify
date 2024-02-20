const db = require('./db')


const conta = db.sequelize.define("conta", {
    id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: db.Sequelize.STRING(100) },
    imagem:  {type: db.Sequelize.BLOB('long'),allowNull: true},
    
})
//conta.sync({force: true})
module.exports = conta