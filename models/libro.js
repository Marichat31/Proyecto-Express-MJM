//Se establece un modelo para representar un Libro usando Sequelize 
const { DataTypes, Model } = require('sequelize')
const sequelize = require('../db/database')

class Libro extends Model { };

Libro.init(
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo:{
            type: DataTypes.STRING
        },
        autor:{
            type: DataTypes.STRING
        },
        anio_publicacion:{
            type: DataTypes.INTEGER
        },
        genero:{
            type: DataTypes.STRING
        }
    },
    {sequelize, modelName: 'Libro', tableName: 'libros',timestamps: false }) 

module.exports = Libro