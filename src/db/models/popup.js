'use strict'
module.exports = (sequelize, DataTypes) => {
  const Popup = sequelize.define('Popup', {
    popupId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    visibility: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    desktopImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobileImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    btnText: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    btnRedirection: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    popupName: {
      type: DataTypes.STRING(255),
      field: 'name',
      allowNull: true
    },
    textOne: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    textTwo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    textThree: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    popName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'popups',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  Popup.associate = function (models) {
    // associations can be defined here
  }
  return Popup
}
