const { DataTypes, Sequelize } = require("sequelize");
const database = require("../config/database");

const Import = database.define(
  "Import",
  {
    importId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    importDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "imp_dt",
    },
    totalAmountUsd: {
      type: DataTypes.DECIMAL(10, 2),
    },
    totalAmountRiel: {
      type: DataTypes.DECIMAL(15, 0),
    },
    totalPaidUsd: {
      type: DataTypes.DECIMAL(10, 2),
    },
    totalPaidRiel: {
      type: DataTypes.DECIMAL(15, 0),
    },
    totalDueUsd: {
      type: DataTypes.DECIMAL(10, 2),
    },
    totalDueRiel: {
      type: DataTypes.DECIMAL(15, 0),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "import",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Import;
