'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'gc_coin',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }),
      queryInterface.addColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'sc_coin',
      {
        type: Sequelize.DOUBLE,
        allowNull: true
      }),
      queryInterface.addColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'after_balance',
      {
        type: Sequelize.JSONB,
        allowNull: true
      }),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'target_id', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'conversion_rate', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'primary_currency_amount', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'amount_type', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'payment_provider', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'error_description', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'payment_transaction_name', {}
      ),
      queryInterface.removeColumn(
        {
          tableName: 'transaction_bankings',
          schema: 'public'
        },
        'before_balance', {}
      ),
      queryInterface.addColumn({
        tableName: 'users',
        schema: 'public'
      }, 'state',
      {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'before_balance',
      {
        type: Sequelize.JSONB,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'gc_coin', Sequelize.DOUBLE),
      queryInterface.removeColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'sc_coin', Sequelize.DOUBLE),
      queryInterface.removeColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'after_balance', Sequelize.JSONB),
      queryInterface.removeColumn({
        tableName: 'transaction_bankings',
        schema: 'public'
      }, 'before_balance', Sequelize.JSONB),
      queryInterface.removeColumn({
        tableName: 'users',
        schema: 'public'
      }, 'state', Sequelize.STRING)
    ])
  }
}
