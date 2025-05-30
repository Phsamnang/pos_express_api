'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Tables', 'tableName', { 
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Tables', 'tableName', { 
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};