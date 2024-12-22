'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('stocks', 'product_id', {
      type: DataTypes.BIGINT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('stocks', 'product_id')
  }
}
