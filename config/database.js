const { Sequelize } = require("sequelize");

const database = new Sequelize('express','postgres','1234',{
    host:'localhost',
    dialect:'postgres'
})

module.exports = database;