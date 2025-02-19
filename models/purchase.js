"use strict";

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    "Purchase",
    {
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      unit: {
        type: DataTypes.STRING, // e.g., 'kg', 'pieces', 'boxes'
        allowNull: false,
      },
      priceInRiel: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      priceInUSD: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.ENUM("USD", "RIEL"),
        allowNull: false,
      },
      purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      supplier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "purchases",
      timestamps: true,
      hooks: {
        beforeValidate: (purchase, options) => {
          // Ensure at least one price is provided
          if (!purchase.priceInRiel && !purchase.priceInUSD) {
            throw new Error("Either price in Riel or USD must be provided");
          }
        },
      },
    }
  );

  Purchase.associate = function (models) {
    // Add relationship with User who made the purchase
    Purchase.belongsTo(models.User, {
      foreignKey: "userId",
      as: "purchasedBy",
      allowNull: false,
    });
  };

  return Purchase;
};
