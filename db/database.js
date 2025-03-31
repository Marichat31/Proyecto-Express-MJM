//Se configura y se establece una conexion a la base de datos usando Sequelize,un ORM(Mapeo de Objeto-Relacional)

const { Sequelize } = require ('sequelize')

const sequelize = new Sequelize('GestionLibros','root','12345678',{
    host: 'localhost',
    dialect: 'mysql',
})

sequelize.authenticate()
    .then(() => console.log('Conectado'))
    .catch((error) => console.log('Error: ',error));

module.exports = sequelize
