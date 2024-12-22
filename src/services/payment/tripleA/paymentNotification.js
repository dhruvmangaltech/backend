import ajv from '../../../libs/ajv'
import Logger from '../../../libs/logger'
import { sendMail } from '../../../libs/customerio'
import ServiceBase from '../../../libs/serviceBase'
import { ERROR_MSG } from '../../../utils/constants/errors'
import { createNewEntity, getOne } from '../../../utils/crud'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { awardPspBonus } from '../../../helpers/awardPspBonus'
import { awardBoostBonus } from '../../../helpers/awardBoostBonus'
import { awardReferralBonus } from '../../../helpers/awardReferralBonus'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import { awardFirstPurchaseBonus } from '../../../helpers/awardFirstPurchaseBonus.helper'
import { EVENT_TYPE, STATUS, TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import { CUSTOMER_IO_TRANSACTION_ID, EMAIL_LOGS_SOURCE, EMAIL_TEMPLATE_TYPES, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['event', 'api_id', 'status']
}

const constraints = ajv.compile(schema)

export class PaymentNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { event, api_id: apiId, payment_reference: paymentReference, status, webhook_data: webhookData, uniqueId, ...moreDetails } = this.args
    const {
      User: UserModel,
      Wallet: WalletModel,
      Country: CountryModel,
      package: PackageModel,
      EmailLog: EmailLogModel,
      TransactionBanking: TransactionBankingModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction

    let txStatus, transactionDetail, query, afterBalance, extraDetails
    let isFirstDeposit = false

    try {
      if (event === EVENT_TYPE.PAYMENT) {
        if (uniqueId) query = { uniqueId }
        else query = { userId: webhookData?.userId }

        const userDetails = await UserModel.findOne({
          where: query,
          include: [{
            model: WalletModel,
            as: 'userWallet',
            lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
            skipLocked: false
          }],
          attributes: ['userId', 'firstName', 'email', 'lastName', 'countryCode', 'referredBy', 'referralCode'],
          transaction
        })

        if (!userDetails) {
          await transaction.rollback()
          return { success: false, status: 404, message: ERROR_MSG.NOT_FOUND }
        }

        const packageDetail = await getOne({ model: PackageModel, data: { packageId: webhookData?.packageId }, attributes: ['packageId', 'gcCoin', 'scCoin', 'firstPurchaseApplicable'] })
        if (!packageDetail) {
          await transaction.rollback()
          return { success: false, status: 404, message: ERROR_MSG.NOT_FOUND }
        }

        const userCountry = await getOne({ model: CountryModel, data: { countryId: userDetails?.countryCode }, attributes: ['code'], raw: true })
        userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

        afterBalance = {
          gcCoin: userDetails.userWallet.gcCoin,
          scCoin: +userDetails.userWallet.totalScCoin
        }

        Logger.info(`TripleA status received - ${status}`)
        if (status === STATUS.HOLD) txStatus = TRANSACTION_STATUS.PENDING
        else if (status === STATUS.SHORT) {
          txStatus = TRANSACTION_STATUS.SHORT
          extraDetails = { shortAmount: moreDetails?.receive_amount }
        } else if (status === STATUS.GOOD) {
          txStatus = TRANSACTION_STATUS.SUCCESS
          afterBalance = {
            gcCoin: userDetails.userWallet.gcCoin + parseFloat(packageDetail.gcCoin),
            scCoin: +userDetails.userWallet.totalScCoin + parseFloat(packageDetail.scCoin)
          }

          const transactionCount = await TransactionBankingModel.count({ col: 'transactionBankingId', where: { actioneeId: userDetails.userId, actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.DEPOSIT, status: TRANSACTION_STATUS.SUCCESS }, transaction })
          if (transactionCount === 0) isFirstDeposit = true
        } else if (status === STATUS.INVALID) txStatus = TRANSACTION_STATUS.CANCELED

        if (txStatus !== undefined) {
          transactionDetail = await getOne({
            model: TransactionBankingModel,
            data: { paymentTransactionId: paymentReference, transactionId: webhookData?.order_id },
            attributes: ['transactionBankingId', 'status', 'afterBalance', 'isFirstDeposit', 'moreDetails'],
            transaction
          })

          if (transactionDetail && txStatus !== TRANSACTION_STATUS.PENDING) await transactionDetail.set({ status: txStatus, afterBalance, isFirstDeposit, moreDetails: { ...transactionDetail.moreDetails, ...extraDetails, receivedAmount: moreDetails?.receive_amount } }).save({ transaction })
          else if (!transactionDetail) {
            transactionDetail = await TransactionBankingModel.create({
              actioneeType: ROLE.USER,
              actioneeId: userDetails.userId,
              actioneeEmail: userDetails.email,
              actioneeName: `${userDetails.firstName} ${userDetails.lastName}`,
              walletId: userDetails.userWallet.walletId,
              amount: moreDetails.order_amount,
              gcCoin: webhookData.gcCoin,
              scCoin: webhookData.scCoin,
              currencyCode: userDetails.userWallet.currencyCode,
              countryCode: userCountry?.code || 'US',
              status: txStatus,
              beforeBalance: { gcCoin: userDetails.userWallet.gcCoin, scCoin: userDetails.userWallet.totalScCoin },
              afterBalance,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              paymentMethod: TRANSACTION_PROVIDER.TRIPLE_A,
              paymentTransactionId: paymentReference,
              transactionDateTime: new Date(),
              isFirstDeposit,
              isSuccess: (txStatus === TRANSACTION_STATUS.SUCCESS),
              transactionId: webhookData.order_id,
              moreDetails: {
                apiId,
                cryptoAmount: moreDetails.payment_crypto_amount,
                cryptoAddress: moreDetails.crypto_address,
                cryptoCurrency: moreDetails.crypto_currency,
                exchangeRate: moreDetails?.exchange_rate,
                packageId: webhookData.packageId,
                ...extraDetails
              }
            }, { transaction })
          }

          if (txStatus === TRANSACTION_STATUS.SUCCESS) {
            userDetails.userWallet.scCoin = { ...userDetails.userWallet.scCoin, psc: +(Math.round((+userDetails.userWallet.scCoin?.psc + +webhookData.scCoin) * 100) / 100).toFixed(2) }
            userDetails.userWallet.gcCoin = +userDetails.userWallet.gcCoin + +webhookData.gcCoin

            await userDetails.userWallet.save({ transaction })

            if (isFirstDeposit && packageDetail.firstPurchaseApplicable) await awardFirstPurchaseBonus({ userId: userDetails.userId, purchasedSc: webhookData.scCoin, purchasedGc: webhookData.gcCoin, sequelizeTransaction: transaction, userWallet: userDetails.userWallet, provider: TRANSACTION_PROVIDER.TRIPLE_A })
            await awardPspBonus({ userId: userDetails.userId, purchasedSc: webhookData.scCoin, purchasedGc: webhookData.gcCoin, sequelizeTransaction: transaction, userWallet: userDetails.userWallet })
            if (userDetails.referredBy) {
              await awardReferralBonus({ userDetails, sequelizeTransaction: transaction })
            }

            await awardBoostBonus({ userId: userDetails.userId, purchasedSc: webhookData.scCoin, purchasedGc: webhookData.gcCoin, sequelizeTransaction: transaction, userWallet: userDetails.userWallet })
            WalletEmitter.emitUserWalletBalance({
              scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
              gcCoin: userDetails.userWallet.gcCoin
            }, userDetails.userId)

            const mailSent = await sendMail(userDetails.email, CUSTOMER_IO_TRANSACTION_ID.DEPOSIT_SUCCESS)
            if (mailSent) {
              await createNewEntity({
                model: EmailLogModel,
                data: {
                  email: userDetails.email,
                  userId: userDetails.userId,
                  emailTemplateId: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.DEPOSIT_SUCCESS],
                  emailTemplateName: EMAIL_TEMPLATE_TYPES.DEPOSIT_SUCCESS,
                  source: EMAIL_LOGS_SOURCE.TRANSACTIONAL,
                  customerIoDeliveryId: mailSent?.delivery_id,
                  customerIoTransactionId: CUSTOMER_IO_TRANSACTION_ID.DEPOSIT_SUCCESS.toString()
                },
                transaction
              })
            }
          }
        }
      } else {
        await transaction.rollback()
        return { success: false, status: 404, message: ERROR_MSG.NOT_FOUND }
      }

      await transaction.commit()
      return { success: true, message: SUCCESS_MSG.TRANSACTION_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      return { success: false, message: ERROR_MSG.SERVER_ERROR }
    }
  }
}
