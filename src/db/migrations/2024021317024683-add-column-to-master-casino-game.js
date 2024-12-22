'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('master_casino_games', 'image_url', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_casino_games', 'image_url')
  }
}
