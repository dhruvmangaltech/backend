'use strict'
module.exports = function (sequelize, DataTypes) {
  const GameSubcategary = sequelize.define('GameSubcategary', {
    gameSubcategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    masterCasinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masterGameSubCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'game_subcategory',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  GameSubcategary.associate = function (model) {
    GameSubcategary.belongsTo(model.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId'
    })
    GameSubcategary.belongsTo(model.MasterGameSubCategory, {
      foreignKey: 'masterGameSubCategoryId'
    })
  }
  return GameSubcategary
}
