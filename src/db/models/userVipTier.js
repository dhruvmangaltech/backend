'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserVipTier = sequelize.define('UserVipTier', {
    userVipTierId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vipTierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  },
  {
    sequelize,
    tableName: 'users_vip_tier',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserVipTier.associate = function (models) {
    UserVipTier.belongsTo(models.VipTier, {
      foreignKey: 'vipTierId',
      constraints: false
    })
    UserVipTier.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      constraints: false
    })
  }

  return UserVipTier
}
