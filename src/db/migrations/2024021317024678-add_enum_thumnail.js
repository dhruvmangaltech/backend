'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("ALTER TYPE \"public\".\"enum_master_casino_games_thumbnail_thumbnail_type\" ADD VALUE 'provider_img';")
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
