'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('email_logs', 'customer_io_transaction_id', {
      type: DataTypes.STRING,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('email_logs', 'customer_io_transaction_id')
  }
}
