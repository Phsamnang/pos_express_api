const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Table = database.define('Table', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tableName: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true 
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved'),
      defaultValue: 'available' 
    }
  });
  
  module.exports = Table;