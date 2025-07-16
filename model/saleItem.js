const { DataTypes } = require("sequelize");
const database = require("../config/database");
const { Sale, Menus } = require("./index");

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
  delivery_sts: {
    type: DataTypes.ENUM(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned"
    ),
    defaultValue: "pending",
    allowNull: false,
  },
  // New fields added here
  startOrderTime: {
    type: DataTypes.DATE, // Use DataTypes.DATE for datetime with timezone (recommended)
    allowNull: true, // Allow null initially, as it might not be set immediately
  },
  completedTime: {
    type: DataTypes.DATE, // Use DataTypes.DATE for datetime with timezone (recommended)
    allowNull: true, // Allow null until the order item is completed
  },
});

module.exports = SaleItem;
