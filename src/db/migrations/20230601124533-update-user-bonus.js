'use strict'

const { BONUS_TYPE } = require('../../utils/constants/constant')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'bonus_type',
    {
      type: Sequelize.STRING,
      allowNull: false
    }
    )
    await queryInterface.removeColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'claimed_at',
    {
      type: Sequelize.DATE,
      allowNull: true
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'bonus_type',
    {
      type: Sequelize.ENUM(Object.values(BONUS_TYPE)),
      allowNull: false,
      defaultValue: Sequelize.literal(`'${BONUS_TYPE.WELCOME_BONUS}'`)
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'bonus_parent_id',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'day',
    {
      type: Sequelize.INTEGER,
      allowNull: true
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'progress_in_day',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'free_spin_amount',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'gc_amount',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'sc_amount',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'is_active',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
    )
    await queryInterface.addColumn({
      tableName: 'user_bonus',
      schema: 'public'
    }, 'claimed_at',
    {
      type: Sequelize.DATE,
      allowNull: true
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
