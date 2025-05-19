const { DataTypes } = require("sequelize");
const database = require("../config/database");
const { Sale, Product, Menus } = require("./index");

const SaleItem = database.define("SaleItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sale,
      key: "id",
    },
  },
  menusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menus,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priceAtSale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = SaleItem;
