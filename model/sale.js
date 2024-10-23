const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Sale = database.define('Sale', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Table,
        key: 'id'
      }
    },
    saleDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING, 
    },
  });
  

  
  module.exports = Sale;