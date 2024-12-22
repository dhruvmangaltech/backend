'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vip_tier', {
      vip_tier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      boost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      rakeback: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bonus_sc: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      bonus_gc: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sc_required_play: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      sc_required_months: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gc_required_purchase: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      gc_required_months: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gradual_loss: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      live_support: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vip_tier')
  }
}
