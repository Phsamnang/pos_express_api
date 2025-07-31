"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the new column, but allow nulls for now
    await queryInterface.addColumn("Sales", "referenceId", {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow nulls
      unique: true,
    });

    // Step 2: Populate the referenceId for all existing rows.
    // This example creates an ID like "20250731-1" using the sale's date and its primary key.
    await queryInterface.sequelize.query(`
      UPDATE "Sales"
      SET "referenceId" = TO_CHAR("saleDate", 'YYYYMMDD') || '-' || "id"
      WHERE "referenceId" IS NULL;
    `);

    // Step 3: Now that all rows have a value, change the column to be NOT NULL.
    await queryInterface.changeColumn("Sales", "referenceId", {
      type: Sequelize.STRING,
      allowNull: false, // Enforce the NOT NULL constraint
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // To roll back, simply remove the column
    await queryInterface.removeColumn("Sales", "referenceId");
  },
};
