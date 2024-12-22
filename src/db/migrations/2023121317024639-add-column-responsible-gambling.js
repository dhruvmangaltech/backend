'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'responsible_gambling',
        schema: 'public'
      }, 'is_removed',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'responsible_gambling', schema: 'public' },
        'is_removed', Sequelize.BOOLEAN)
    ])
  }
}
