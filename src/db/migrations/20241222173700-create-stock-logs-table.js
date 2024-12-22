'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('stock_logs', {
      stock_log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      actionee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'admin_users',
            schema: 'public'
          },
          key: 'admin_user_id'
        }
      },
      action_type: { // added, removed, cancel
        type: DataTypes.STRING
      },
      action_id: { //  DEBIT: '0', CREDIT: '1', CANCEL: '2'
        type: DataTypes.STRING
      },
      stock_id: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.INTEGER
      },
      before_balance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      after_balance: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('stock_logs', { schema: 'public' })
  }
}
