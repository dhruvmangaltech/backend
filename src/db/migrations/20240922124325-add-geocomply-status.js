'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'users',
      schema: 'public'
    }, 'id_comply_status',
    {
      type: Sequelize.STRING,
      allowNull: true
    }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'users',
      schema: 'public'
    }, 'id_comply_status', Sequelize.STRING)
  }
}
