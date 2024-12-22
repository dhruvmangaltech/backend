'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('products', {
      product_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sclae: {
        type: DataTypes.STRING,
        allowNull: true
      },
      colour: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
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
      is_active: {
        type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('products', { schema: 'public' })
  }
}
