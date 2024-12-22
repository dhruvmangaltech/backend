'use strict'
module.exports = (sequelize, DataTypes) => {
  const BonusVipTiers = sequelize.define('BonusVipTiers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bonusId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VipTierId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bonus_vip_tiers',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  BonusVipTiers.associate = function (models) {
    BonusVipTiers.belongsTo(models.Bonus, { foreignKey: 'bonusId' })
    BonusVipTiers.belongsTo(models.VipTier, { foreignKey: 'VipTierId' })
  }
  return BonusVipTiers
}
