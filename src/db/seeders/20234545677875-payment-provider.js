'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payment_provider', [
      {
        provider_name: 'Triple A',
        deposit_is_active: true,
        withdraw_is_active: true,
        supports_deposit: true,
        supports_withdraw: true
      },
      {
        provider_name: 'Paynote',
        deposit_is_active: true,
        withdraw_is_active: true,
        supports_deposit: true,
        supports_withdraw: true
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payment_provider', null, {})
  }
}
