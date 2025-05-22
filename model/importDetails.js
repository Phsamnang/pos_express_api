const { DataTypes, Sequelize } = require("sequelize");
const database = require("../config/database");

const ImportDetail = database.define(
  "ImportDetail",
  {
    importDetailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "item_id",
    },
    importId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "bill_id", // Foreign key linking to the Import table
      references: {
        model: "Import", // Name of the Import model
        key: "importId", // Primary key of the Import model
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    itemNumber: {
      type: DataTypes.INTEGER,
      field: "item_number",
    },
    description: {
      type: DataTypes.STRING(255),
      field: "description",
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      field: "quantity",
    },
    unitPriceUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field: "unit_price_usd",
    },
    unitPriceRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field: "unit_price_riel",
    },
    totalPriceUsd: {
      type: DataTypes.DECIMAL(10, 2),
      field: "total_price_usd",
    },
    totalPriceRiel: {
      type: DataTypes.DECIMAL(15, 0),
      field: "total_price_riel",
    },
    paymentStatus: {
      type: DataTypes.STRING(20),
      field: "payment_status",
    },
    notes: {
      type: DataTypes.TEXT,
      field: "notes",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      field: "updated_at",
    },
  },
  {
    tableName: "bill_items",
    timestamps: true,
    underscored: true,
  }
);

module.exports = ImportDetail;
