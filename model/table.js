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
    field: "table_name",
  },
  status: {
    type: DataTypes.ENUM("available", "occupied", "reserved"),
    defaultValue: "available",
    field: "sts"
  },
  tableTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: TableType,
      key: "id",
    },
    field: "table_type_id",
  },
},{
  tableName: "tb_table",
  timestamps: true,
  underscored: true,
});

module.exports = Table;
