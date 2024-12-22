'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('casino_transactions', ['round_id'], {
        name: 'casino_transactions_round_id_index'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('casino_transactions', 'casino_transactions_round_id_index')
  }

}
