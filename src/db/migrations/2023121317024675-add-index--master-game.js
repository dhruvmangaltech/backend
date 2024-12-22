'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('master_casino_games', ['identifier'], {
        name: 'master_casino_game_identifier_at_index'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('master_casino_games', 'master_casino_game_identifier_at_index')
  }

}
