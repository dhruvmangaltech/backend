'use strict'
module.exports = function (sequelize, DataTypes) {
  const Affiliate = sequelize.define('Affiliate', {
    affiliateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    trackingToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userIdAffiliate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userHashId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentIdAffiliate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentUsername: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminIdAffiliate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    adminUsername: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    paymentType: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    minimumPayment: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    marketing: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    skype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    termsAgreement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otherDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'affiliates',
    schema: 'public',
    timestamps: true,
    underscored: true

  })
  Affiliate.associate = function (model) {
    Affiliate.hasMany(model.User, { as: 'users', foreignKey: 'affiliateId', onDelete: 'cascade' })
    Affiliate.hasMany(model.TransactionAffiliate, { as: 'transactionAffiliates', foreignKey: 'affiliateId' })
  }
  return Affiliate
}
