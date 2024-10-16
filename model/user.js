const { DataTypes } = require("sequelize");
const database = require("../config/database");

const User = database.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,   
      validate: {
        isEmail: true 
      }
    },
     name: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = User;