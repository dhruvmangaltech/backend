'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users_vip_tier', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      vip_tier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vip_tier',
          key: 'vip_tier_id'
        }
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vip_tier')
  }
}
