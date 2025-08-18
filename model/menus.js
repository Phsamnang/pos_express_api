const { DataTypes } = require("sequelize");
const database = require("../config/database");
const Category = require("./category");

const Menus = database.define(
  "menus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
    isCooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    cookTime: {
      type: DataTypes.INTEGER,
      field: "cook_time",
    },
  },
  {
    underscored: true,
    tableName: "tb_menus",
  }
);

module.exports = Menus;
