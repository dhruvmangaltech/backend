'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_activities', 'referred_to_code', {
      type: Sequelize.UUID,
      allowNull: true, // or false depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If needed, you can add a down migration to revert the addition of the column.
    // For simplicity, it's left empty in this example.
  }
};
