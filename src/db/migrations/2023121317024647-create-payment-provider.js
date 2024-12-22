'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_provider', {
      provider_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      provider_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deposit_is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      withdraw_is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      supports_deposit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      supports_withdraw: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment_provider')
  }
}
