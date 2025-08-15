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
      field:'ttl_amt_usd'
    },
    totalAmountRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field:'ttl_amt_riel'
    },
    totalPaidUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field:'ttl_paid_usd'
    },
    totalPaidRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field:'ttl_paid_riel'
    },
    totalDueUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field:'ttl_due_usd'
    },
    totalDueRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field:'ttl_due_riel'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "tb_import",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Import;
