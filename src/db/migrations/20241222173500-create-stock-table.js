'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('stocks', {
      stock_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'admin_users',
            schema: 'public'
          },
          key: 'admin_user_id'
        }
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('stocks', { schema: 'public' })
  }
}
