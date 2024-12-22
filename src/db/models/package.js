'use strict'

module.exports = (sequelize, DataTypes) => {
  const AllPackage = sequelize.define('package', {
    packageId: {
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
    previousAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    gcCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    scCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVisibleInStore: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    packageType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    showPackageType: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bonusId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vipPoints: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    firstPurchaseApplicable:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'first_purchase_bonus_applicable'
    }
  }, {
    sequelize,
    tableName: 'package',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  AllPackage.associate = function (models) {
    AllPackage.hasOne(models.Bonus, { foreignKey: 'bonusId', as: 'bonus' })
    AllPackage.hasMany(models.PackageUsers, { foreignKey: 'packageId' })
  }
  return AllPackage
}
