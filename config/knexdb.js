const knex = require("knex");
const knexConfig = require("./knexfile");

const knexdb = knex(knexConfig.development);

module.exports = knexdb;
