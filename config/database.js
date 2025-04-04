const { Sequelize } = require("sequelize");

const database = new Sequelize("express", "postgres", "1234", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

module.exports = database;