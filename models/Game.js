const { DataTypes, Model } = require('sequelize');
const db = require('../config/connection');


class Game extends Model { }

Game.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: {
                args: 0,
                msg: 'Please enter a valid title.'
            },

        }
    },
    description: {
        type: DataTypes.TEXT
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    released_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publisher: {
      type: DataTypes.STRING,
    },
    developer: {
      type: DataTypes.STRING,
    },
},

    {
        modelName: 'game',
        freezeTableName: true,
        sequelize: db,
    })



module.exports = Game
