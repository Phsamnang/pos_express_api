const { DataTypes, Op } = require("sequelize");
const database = require("../config/database");
const { Table } = require("./index");

const Sale = database.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Add a new field for your human-readable, sequential ID
    referenceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure no two sales have the same reference
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Table,
        key: "id",
      },
    },
    saleDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
  },
  {
    // Add the hook logic here
    hooks: {
      beforeValidate: async (sale, options) => {
        // This logic runs only if a referenceId has not been set yet
        if (!sale.referenceId) {
          const today = new Date();
          const year = today.getFullYear();
          const month = (today.getMonth() + 1).toString().padStart(2, "0");
          const day = today.getDate().toString().padStart(2, "0");

          const datePrefix = `${year}${month}${day}`; // e.g., "20250731"

          // Find the last sale created today within the same transaction
          const lastSale = await Sale.findOne({
            where: {
              referenceId: {
                [Op.like]: `${datePrefix}%`,
              },
            },
            order: [["referenceId", "DESC"]],
            lock: options.transaction.LOCK.UPDATE, // Lock the row to prevent race conditions
            transaction: options.transaction,
          });

          let nextIdNumber = 1;

          // This is the missing logic
          if (lastSale) {
            // Extract the number part from the end of the string (e.g., "0001")
            const lastIdString = lastSale.referenceId.substring(8);
            // Convert it to a number
            const lastIdNumber = parseInt(lastIdString, 10);
            // Increment it for the new ID
            nextIdNumber = lastIdNumber + 1;
          }
      
           const paddedSequence = nextIdNumber.toString().padStart(4, "0");
          // Format the new ID (e.g., "20250731-001")
          const nextId = `${datePrefix}${paddedSequence}`;
          sale.referenceId = nextId;
        }
      },
    },
  }
);

module.exports = Sale;
