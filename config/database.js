const { Sequelize } = require("sequelize");

const database = new Sequelize('express','postgres','2002',{
    host:'localhost',
    dialect:'postgres'
})

module.exports = database;