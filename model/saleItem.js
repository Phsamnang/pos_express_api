const { DataTypes } = require("sequelize");
const database = require("../config/database");

const SaleItem = database.define('SaleItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sale,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,   
  
      allowNull: false
    },
    priceAtSale: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });

  module.exports = SaleItem;