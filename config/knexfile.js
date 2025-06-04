module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost:5432", // Or your PostgreSQL server's host
      user: "postgres",
      password: "1234",
      database: "express",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      tableName: "knex_seeds",
    },
  },
};
