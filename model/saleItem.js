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
    field: "sale_id",
  },
  menusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menus,
      key: "id",
    },
    field: "menus_id",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "quantity",
  },
  priceAtSale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: "price_at_sale",
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
    field: "start_order_time",
  },
  completedTime: {
    type: DataTypes.DATE, // Use DataTypes.DATE for datetime with timezone (recommended)
    allowNull: true, // Allow null until the order item is completed
    field: "completed_time",
  },
},{
  tableName: "tb_sale_item",
  timestamps: true,
  underscored: true,
});

module.exports = SaleItem;
