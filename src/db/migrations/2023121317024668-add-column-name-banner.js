'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('page_banners', 'name', {
      type: Sequelize.STRING(255),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('page_banners', 'name')
  }
}
