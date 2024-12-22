'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'bonus',
        schema: 'public'
      }, 'provider_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'payment_provider',
            schema: 'public'
          },
          key: 'provider_id'
        }
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'bonus', schema: 'public' },
        'payment_provider', Sequelize.STRING)
    ])
  }
}
