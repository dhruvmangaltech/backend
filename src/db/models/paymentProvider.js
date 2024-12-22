'use strict'

module.exports = (sequelize, DataTypes) => {
  const PaymentProvider = sequelize.define(
    'PaymentProvider',
    {
      providerId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      providerName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      depositIsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      withdrawIsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      supportsDeposit: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      supportsWithdraw: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'payment_provider',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  return PaymentProvider
}
