'use strict'

module.exports = function (sequelize, DataTypes) {
  const VipTier = sequelize.define(
    'VipTier',
    {
      vipTierId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      boost: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rakeback: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bonusSc: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      bonusGc: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      scRequiredPlay: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'sc_required_play'
      },
      scRequiredMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'sc_required_months'
      },
      gcRequiredPurchase: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'gc_required_purchase'
      },
      gcRequiredMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'gc_required_months'
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gradualLoss: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      liveSupport: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'VipTier', // This is the model name that you'll use when querying the database
      tableName: 'vip_tier',
      schema: 'public',
      timestamps: true, // If you want Sequelize to automatically manage createdAt and updatedAt fields
      underscored: true
    }
  )

  VipTier.associate = function (models) {
    VipTier.hasOne(models.Bonus, { foreignKey: 'bonusId' })
    VipTier.hasMany(models.UserVipTier, { foreignKey: 'vipTierId' })
  }

  return VipTier
}
