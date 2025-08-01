const { Sequelize } = require("sequelize");
const {development} = require("./config.json");

const th = development.database || "sndrmanagement";

const database = new Sequelize(th,development.username, development.password, {
  host: development.host || "localhost",
  port: 5432,
  dialect: "postgres",
});

module.exports = database;