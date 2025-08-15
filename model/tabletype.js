const { DataTypes } = require("sequelize");
const database = require("../config/database");

const TableType = database.define("table_type", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    field: "name",
  },
},{
  tableName: "tb_table_type",
  underscored: true,
});

module.exports = TableType;
