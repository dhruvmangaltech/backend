'use strict'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const TransactionBanking = sequelize.define('TransactionBanking', {
    transactionBankingId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    actioneeType: {
      type: DataTypes.STRING
    },
    actioneeId: {
      type: DataTypes.INTEGER
    },
    actioneeEmail: {
      type: DataTypes.STRING
    },
    actioneeName: {
      type: DataTypes.STRING
    },
    walletId: {
      type: DataTypes.INTEGER
    },
    currencyCode: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.FLOAT
    },
    gcCoin: {
      type: DataTypes.DOUBLE
    },
    scCoin: {
      type: DataTypes.DOUBLE
    },
    beforeBalance: {
      type: DataTypes.JSONB
    },
    afterBalance: {
      type: DataTypes.JSONB
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: TRANSACTION_STATUS.PENDING
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4
    },
    transactionDateTime: {
      type: DataTypes.DATE
    },
    transactionType: {
      type: DataTypes.STRING
    },
    isSuccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isFirstDeposit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    elasticUpdated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'transaction_bankings',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  TransactionBanking.associate = function (models) {
    TransactionBanking.belongsTo(models.Wallet, {
      as: 'wallet',
      foreignKey: 'walletId'
    })
    TransactionBanking.belongsTo(models.User, {
      foreignKey: 'actioneeId',
      constraints: false,
      as: 'transactionUser'
    })
    TransactionBanking.belongsTo(models.WithdrawRequest, {
      foreignKey: 'actioneeId',
      targetKey: 'userId'
    })
  }

  return TransactionBanking
}
