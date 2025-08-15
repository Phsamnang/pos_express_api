const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Category = database.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: "tb_category",
  }
);

module.exports = Category;
