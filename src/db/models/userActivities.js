'use strict'

const { USER_ACTIVITIES_TYPE } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const UserActivities = sequelize.define('UserActivities', {
    userActivityId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    activityType: {
      type: DataTypes.ENUM(Object.values(USER_ACTIVITIES_TYPE)),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: `${DataTypes.UUIDV4}`
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true
    },
    referredToCode: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'referred_to_code'
    }
  }, {
    indexes: [
      {
        name: 'user_activity',
        fields: ['activity_type', 'user_id']
      }
    ],
    sequelize,
    tableName: 'user_activities',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserActivities.associate = function (models) {
    UserActivities.belongsTo(models.User, { foreignKey: 'userId' })
  }

  return UserActivities
}
