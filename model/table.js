const { DataTypes } = require("sequelize");
const database = require("../config/database");
const TableType = require("./tabletype");

const Table = database.define("Table", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tableName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM("available", "occupied", "reserved"),
    defaultValue: "available",
  },
  tableTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: TableType,
      key: "id",
    },
  },
});
  
  module.exports = Table;