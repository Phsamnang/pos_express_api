const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Product = database.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name",
  },
  description: {
    type: DataTypes.TEXT,
    field: "description",
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: "price",
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
    field: "currency",
  },
},{
  tableName: "tb_product",
  timestamps: true,
  underscored: true,
});

module.exports = Product;
