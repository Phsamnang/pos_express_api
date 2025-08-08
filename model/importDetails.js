const { DataTypes, Sequelize } = require("sequelize");
const database = require("../config/database");

const ImportDetail = database.define(
  "ImportDetail",
  {
    importDetailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "imp_dtl_id",
    },
    importId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "imp_id", // Foreign key linking to the Import table
      references: {
        model: "Import", // Name of the Import model
        key: "importId", // Primary key of the Import model
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    productName: {
      type: DataTypes.STRING,
      field: "prod_name",
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
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
      field: "currency", // Currency type, default is USD
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
    tableName: "import_detail",
    timestamps: true,
    underscored: true,
  }
);

module.exports = ImportDetail;
