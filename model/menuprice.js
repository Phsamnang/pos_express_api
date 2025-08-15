const { DataTypes } = require("sequelize");
const database = require("../config/database");
const TableType = require("./tabletype");
const Menus = require("./menus");

const MenusPrice = database.define(
  "menus_price",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      field: "price",
    },
    tableTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: TableType,
        key: "id",
      },
      field: "table_type_id",
    },
    menusId: {
      type: DataTypes.INTEGER,
      references: {
        model: Menus,
        key: "id",
      },
      field: "menus_id",
    },
  },
  {
    underscored: true,
    tableName: "tb_menus_price",
  }
);

module.exports = MenusPrice;
