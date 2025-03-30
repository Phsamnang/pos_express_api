const { DataTypes, Sequelize } = require("sequelize");
const database = require("../config/database");

const Import = database.define(
  "Import",
  {
    importId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "bill_id",
    },
    billDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "bill_date",
    },
    totalAmountUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_amount_usd",
    },
    totalAmountRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field: "total_amount_riel",
    },
    totalPaidUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_paid_usd",
    },
    totalPaidRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field: "total_paid_riel",
    },
    totalDueUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_due_usd",
    },
    totalDueRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field: "total_due_riel",
    },
    currency: {
      type: DataTypes.STRING(10),
      field: "currency",
    },
    paymentStatus: {
      type: DataTypes.STRING(20),
      field: "payment_status",
    },
    receiptNumber: {
      type: DataTypes.STRING(50),
      field: "receipt_number",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP"
      ),
      field: "updated_at",
    },
  },
  {
    tableName: "bills",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Import;
