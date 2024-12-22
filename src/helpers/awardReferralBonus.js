import models from '../db/models'
import { createNewEntity, getOne } from '../utils/crud'
import { plus } from 'number-precision'
import { ACTION_TYPE, BONUS_TYPE, TRANSACTION_STATUS, USER_ACTIVITIES_TYPE } from '../utils/constants/constant'
import { v4 as uuid } from 'uuid'
import Logger from '../libs/logger'

export const awardReferralBonus = async ({ userDetails, sequelizeTransaction }) => {
  const {
    Bonus: BonusModel,
    UserBonus: UserBonusModel,
    CasinoTransaction: CasinoTransactionModel,
    UserActivities: UserActivitiesModel,
    User: UserModel,
    Wallet: WalletModel
  } = models

  try {
    const bonusData = await getOne({
      model: BonusModel,
      data: {
        isActive: true,
        bonusType: BONUS_TYPE.REFERRAL_BONUS
      },
      transaction: sequelizeTransaction
    })

    if (!bonusData) {
      return 'ReferralBonusNotFound'
    }

    if (!userDetails.referredBy) {
      return 'UserIsNotReferredUser'
    }

    // const referByUser = await getOne({
    //   model: UserModel,
    //   data: {
    //     referralCode: userDetails.referredBy
    //   }
    // })
    const referredUserDetails = await getOne({
      model: UserModel,
      data: { referralCode: userDetails.referredBy },
      include: [{ model: WalletModel, as: 'userWallet' }],
      attributes: ['userId', 'firstName', 'email', 'lastName', 'countryCode', 'moreDetails', 'referredBy', 'referralCode'],
      lock: { level: sequelizeTransaction.LOCK.UPDATE, of: WalletModel },
      skipLocked: false,
      transaction: sequelizeTransaction
    })

    const referByUserId = referredUserDetails.userId

    const isBonusClaimed = await getOne({
      model: UserActivitiesModel,
      data: {
        userId: referByUserId,
        activityType: USER_ACTIVITIES_TYPE.REFERRED_BONUS_CLAIMED,
        referredToCode: userDetails.referralCode
      }
    })

    if (isBonusClaimed) return 'BonusAlreadyClaimed'

    let balanceObj = {
      beforeScBalance: +(Math.round((+referredUserDetails.userWallet.scCoin.bsc + +referredUserDetails.userWallet.scCoin.psc + +referredUserDetails.userWallet.scCoin.wsc) * 100) / 100).toFixed(2),
      beforeGcBalance: +referredUserDetails.userWallet.gcCoin
    }

    referredUserDetails.userWallet.gcCoin = +plus(+bonusData.gcAmount, +referredUserDetails.userWallet.gcCoin).toFixed(2)

    referredUserDetails.userWallet.scCoin = {
      ...referredUserDetails.userWallet.scCoin,
      bsc: +plus(+bonusData.scAmount, +referredUserDetails.userWallet.scCoin.bsc).toFixed(2)
    }

    await referredUserDetails.userWallet.save({ transaction: sequelizeTransaction })

    balanceObj = {
      ...balanceObj,
      afterScBalance:
        (+referredUserDetails.userWallet.scCoin.bsc || 0) +
        (+referredUserDetails.userWallet.scCoin.psc || 0) +
        (+referredUserDetails.userWallet.scCoin.wsc || 0),
      afterGcBalance: +referredUserDetails.userWallet.gcCoin.toFixed(2)
    }

    const isCreated = await createNewEntity({
      model: UserBonusModel,
      data: {
        bonusId: bonusData.bonusId,
        userId: referByUserId,
        bonusType: BONUS_TYPE.REFERRAL_BONUS,
        scAmount: bonusData.scAmount,
        gcAmount: bonusData.gcAmount,
        claimedAt: new Date()
      },
      transaction: sequelizeTransaction
    })

    await CasinoTransactionModel.create({
      userId: referByUserId,
      actionType: BONUS_TYPE.REFERRAL_BONUS,
      actionId: ACTION_TYPE.CREDIT,
      status: TRANSACTION_STATUS.SUCCESS,
      walletId: referredUserDetails.userWallet.walletId,
      currencyCode: referredUserDetails.userWallet.currencyCode,
      userBonusId: isCreated.userBonusId,
      sc: bonusData.scAmount,
      gc: bonusData.gcAmount,
      amountType: null,
      moreDetails: balanceObj,
      roundId: 'NULL',
      transactionId: `${new Date(
        new Date().toString().split('GMT')[0] + ' UTC'
      ).toISOString()}-TRANSACTION`
    }, { transaction: sequelizeTransaction })

    await createNewEntity({
      model: UserActivitiesModel,
      data: { activityType: USER_ACTIVITIES_TYPE.REFERRED_BONUS_CLAIMED, userId: referByUserId, referredToCode: userDetails.referralCode, uniqueId: uuid() },
      transaction: sequelizeTransaction
    })
  } catch (error) {
    Logger.info(`Error in Referral Bonus - ${JSON.stringify(error)}`)
    return 'InternalServerErrorType'
  }
}
