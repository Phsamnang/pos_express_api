const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Product = database.define('Product', {
    name: {
      type: DataTypes.STRING,   
  
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10,   
   2), 
      allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'       
        }
      }
  });
  
  module.exports = Product;