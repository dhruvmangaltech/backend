'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('products', 'name', {
      type: DataTypes.BIGINT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'name')
  }
}
