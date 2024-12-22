'use strict'
import {
  ROLE,
  SIGN_IN_METHOD,
  STATUS_VALUE
} from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      userId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isLexisNexisVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: true
      },
      signInCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      signInIp: {
        type: DataTypes.INET,
        allowNull: true
      },
      signInMethod: {
        type: DataTypes.ENUM(Object.values(SIGN_IN_METHOD)),
        allowNull: false,
        comment: 'normal:0, google:1, facebook:2'
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      countryCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      selfExclusion: {
        type: DataTypes.DATE,
        allowNull: true
      },
      selfExclusionUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      disabledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      disabledByType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disabledById: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      disableReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      newPasswordKey: {
        type: DataTypes.STRING,
        allowNull: true
      },
      newPasswordRequested: {
        type: DataTypes.DATE,
        allowNull: true
      },
      emailToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      zipCode: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      affiliateId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      kycStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: STATUS_VALUE.PENDING
      },
      documentLabels: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      requestedDocuments: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      loyaltyPoints: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      loggedIn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      affiliateStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      trackingToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      isAffiliateUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      state: {
        type: DataTypes.STRING
      },
      kycApplicantId: {
        type: DataTypes.STRING
      },
      ssnApplicantId: {
        type: DataTypes.STRING
      },
      ssnStatus: {
        type: DataTypes.STRING,
        defaultValue: 'PENDING'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      fbUserId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpVerifiedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isBan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isRestrict: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      passwordAttempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isInternalUser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      veriffStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'PENDING'
      },
      ssn: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      ssnUpdateCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'ssn_update_count'
      },
      referralCode: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        field: 'referral_code'
      },
      referredBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'referred_by'
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          isRedemptionSubscribed: false,
          isSubscribed: false,
          lexisNexisComprehensiveIndex: 0,
          verified: false
        }
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      idComplyStatus: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  User.associate = function (model) {
    User.hasMany(model.UserDocument, {
      as: 'userDocuments',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PackageUsers, {
      as: 'packageUsers',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.ResponsibleGambling, {
      as: 'responsibleGambling',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.Wallet, {
      foreignKey: 'ownerId',
      as: 'userWallet',
      constraints: false,
      scope: {
        ownerType: ROLE.USER
      },
      onDelete: 'cascade'
    })
    User.hasOne(model.Limit, {
      foreignKey: 'userId',
      as: 'userLimit',
      constraints: false,
      onDelete: 'cascade'
    })
    User.hasMany(model.TransactionBanking, {
      foreignKey: 'actioneeId',
      as: 'transactionBanking',
      constraints: false,
      scope: {
        actioneeType: ROLE.USER
      }
    })
    User.hasMany(model.FavoriteGame, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserBonus, {
      as: 'userBonus',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserDocument, {
      as: 'userDocument',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.CasinoTransaction, {
      as: 'casinoTransactions',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PostalCode, {
      as: 'userPostalCode',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.ActivityLog, {
      foreignKey: 'actioneeId',
      sourceKey: 'userId',
      scope: {
        actioneeType: ROLE.USER
      }
    })
    User.hasMany(model.UserActivities, {
      as: 'userActivity',
      foreignKey: 'userId'
    })
    User.hasMany(model.UserVipTier, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
  }

  return User
}
