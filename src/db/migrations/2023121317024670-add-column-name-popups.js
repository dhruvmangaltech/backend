'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('popups', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      visibility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      desktop_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      popup_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      mobile_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btn_text: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btn_redirection: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_one: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_two: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text_three: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    }, {
      schema: 'public',
      timestamps: true
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('popups', { schema: 'public' })
  }
}
