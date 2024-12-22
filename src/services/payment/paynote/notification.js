import ajv from '../../../libs/ajv'
import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { sendMail } from '../../../libs/customerio'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { awardBoostBonus } from '../../../helpers/awardBoostBonus'
import { ERRORS, ERROR_MSG } from '../../../utils/constants/errors'
import { awardReferralBonus } from '../../../helpers/awardReferralBonus'
import { createNewEntity, getOne, updateEntity } from '../../../utils/crud'
import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import { awardFirstPurchaseBonus } from '../../../helpers/awardFirstPurchaseBonus.helper'
import { EVENT_TYPE, PROVIDER_ACTION_STATUS, PAYNOTE_FAILED_TRANSACTION_COUNT, STATUS, TRANSACTION_PROVIDER } from '../../../utils/constants/payment'
import { CUSTOMER_IO_TRANSACTION_ID, EMAIL_LOGS_SOURCE, EMAIL_TEMPLATE_TYPES, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'

const schema = {
  type: 'object',
  required: ['event']
}

const constraints = ajv.compile(schema)

export class PaynoteNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { event, check } = this.args
    const {
      User: UserModel,
      Wallet: WalletModel,
      Country: CountryModel,
      package: PackageModel,
      EmailLog: EmailLogModel,
      WithdrawRequest: WithdrawRequestModel,
      TransactionBanking: TransactionBankingModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction

    let txStatus, transactionDetail, afterBalance, query, transactionType, transactionData, packageDetail
    let isFirstDeposit = false

    try {
      if (event === EVENT_TYPE.TRANSACTION_STATUS) {
        if (check.description.toLowerCase() === TRANSACTION_TYPE.WITHDRAW) {
          query = { email: check.rec_email }
          transactionType = TRANSACTION_TYPE.WITHDRAW
        } else {
          if (check.description.includes('Refund')) query = { email: check.rec_email }
          else query = { email: check.sndr_email }

          transactionType = TRANSACTION_TYPE.DEPOSIT
        }

        const userDetails = await UserModel.findOne({
          where: query,
          include: [{
            model: WalletModel,
            as: 'userWallet',
            lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
            skipLocked: false
          }],
          attributes: ['userId', 'firstName', 'email', 'lastName', 'countryCode', 'moreDetails', 'referredBy', 'referralCode', 'isBan', 'isRestrict'],
          transaction
        })

        if (!userDetails) {
          await transaction.rollback()
          return { success: false, status: 404, message: ERROR_MSG.NOT_FOUND }
        }

        userDetails.userWallet.reload({ lock: { level: transaction.LOCK.UPDATE, of: WalletModel }, transaction })

        if (check.status === STATUS.PENDING) txStatus = TRANSACTION_STATUS.PENDING
        else if (check.status === STATUS.PAID || check.status === STATUS.PROCESSED) txStatus = TRANSACTION_STATUS.SUCCESS
        else if (check.status === STATUS.FAILED) txStatus = TRANSACTION_STATUS.CANCELED
        else if (check.status.toLowerCase() === STATUS.REFUNDED) txStatus = TRANSACTION_STATUS.REFUND
        else if (check.status.toLowerCase() === STATUS.REFUND_PENDING) txStatus = TRANSACTION_STATUS.INPROGRESS
        else if (check.status.toLowerCase() === STATUS.REFUND_FAILED) txStatus = TRANSACTION_STATUS.FAILED

        if (check.description.includes('Refund')) {
          const transactionId = check.description.split('#')[1]

          transactionDetail = await getOne({
            model: TransactionBankingModel,
            data: { paymentTransactionId: transactionId, status: { [Op.in]: [TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.INPROGRESS] }, transactionType },
            attributes: ['transactionBankingId', 'status', 'moreDetails', 'gcCoin', 'scCoin'],
            transaction
          })

          if (transactionDetail) {
            await transactionDetail.set({ moreDetails: { ...transactionDetail.moreDetails, refundId: check.number, refundCheckId: check.check_id } }).save({ transaction })

            if (txStatus === TRANSACTION_STATUS.CANCELED) {
              await transactionDetail.set({ status: TRANSACTION_STATUS.SUCCESS }).save({ transaction })

              await userDetails.userWallet.set({
                gcCoin: +userDetails.userWallet.gcCoin + +transactionDetail.gcCoin,
                scCoin: { ...userDetails.userWallet.scCoin, psc: +(+userDetails.userWallet.scCoin.psc + +transactionDetail.scCoin).toFixed(2) }
              }).save({ transaction })

              WalletEmitter.emitUserWalletBalance({
                scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
                gcCoin: userDetails.userWallet.gcCoin
              }, userDetails.userId)
            } else if ((txStatus !== TRANSACTION_STATUS.SUCCESS && txStatus !== undefined && txStatus !== STATUS.UNPAID) || txStatus === TRANSACTION_STATUS.PENDING) {
              if (((+userDetails.userWallet.gcCoin - +transactionDetail.gcCoin) < 0) || ((+userDetails.userWallet.scCoin.psc - +transactionDetail.scCoin) < 0)) {
                await transaction.rollback()
                return { success: false, message: 'Coins used by player, cannot void/refund the transaction amount' }
              }

              await userDetails.userWallet.set({
                gcCoin: +userDetails.userWallet.gcCoin - +transactionDetail.gcCoin,
                scCoin: { ...userDetails.userWallet.scCoin, psc: +(+userDetails.userWallet.scCoin.psc - +transactionDetail.scCoin).toFixed(2) }
              }).save({ transaction })

              WalletEmitter.emitUserWalletBalance({
                scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
                gcCoin: userDetails.userWallet.gcCoin
              }, userDetails.userId)
            }
          }
        } else {
          const userCountry = await getOne({ model: CountryModel, data: { countryId: userDetails?.countryCode }, attributes: ['code'], raw: true, transaction })
          transactionData = {
            actioneeType: ROLE.USER,
            actioneeId: userDetails.userId,
            actioneeEmail: userDetails.email,
            actioneeName: `${userDetails.firstName} ${userDetails.lastName}`,
            walletId: userDetails.userWallet.walletId,
            amount: check.amount,
            currencyCode: userDetails.userWallet.currencyCode,
            countryCode: userCountry?.code || 'US',
            paymentMethod: TRANSACTION_PROVIDER.PAYNOTE,
            paymentTransactionId: check.number,
            transactionDateTime: new Date(),
            isFirstDeposit,
            transactionType,
            isSuccess: (txStatus === TRANSACTION_STATUS.SUCCESS),
            beforeBalance: { gcCoin: +userDetails.userWallet.gcCoin, scCoin: +userDetails.userWallet.totalScCoin },
            afterBalance: {
              gcCoin: +userDetails.userWallet.gcCoin,
              scCoin: +userDetails.userWallet.totalScCoin
            }
          }

          if (transactionType === TRANSACTION_TYPE.WITHDRAW) {
            const requestDetails = await getOne({
              model: WithdrawRequestModel,
              data: {
                [Op.or]: { transactionId: { [Op.in]: [check.check_id, check.identifier, check.number] } }
              },
              attributes: ['withdrawRequestId', 'status', 'moreDetails', 'transactionId'],
              transaction
            })

            if (!requestDetails || ![TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.INPROGRESS].includes(requestDetails.status)) {
              await transaction.rollback()
              return { success: false, status: 400, message: ERRORS.BAD_REQUEST }
            }

            transactionData = {
              ...transactionData,
              gcCoin: 0,
              scCoin: check.amount,
              moreDetails: {
                checkId: check.check_id,
                identifier: check?.identifier,
                bankName: check.rec_bname,
                acc: check.rec_lbacc
              }
            }

            if (txStatus === TRANSACTION_STATUS.CANCELED) {
              afterBalance = {
                gcCoin: +userDetails.userWallet.gcCoin,
                scCoin: +userDetails.userWallet.totalScCoin + parseFloat(check.amount)
              }
            }
          } else if (transactionType === TRANSACTION_TYPE.DEPOSIT) {
            packageDetail = await getOne({ model: PackageModel, data: { packageId: check.description.split('packageId: ')[1] }, attributes: ['packageId', 'gcCoin', 'scCoin', 'firstPurchaseApplicable'] })
            if (!packageDetail) {
              await transaction.rollback()
              return { success: false, status: 404, message: ERROR_MSG.NOT_FOUND }
            }

            const transactionCount = await TransactionBankingModel.count({ col: 'transactionBankingId', where: { actioneeId: userDetails.userId, actioneeType: ROLE.USER, transactionType: TRANSACTION_TYPE.DEPOSIT, status: TRANSACTION_STATUS.SUCCESS }, transaction })
            if (transactionCount === 0) isFirstDeposit = true

            transactionData = {
              ...transactionData,
              isFirstDeposit,
              gcCoin: packageDetail.gcCoin,
              scCoin: packageDetail.scCoin,
              moreDetails: {
                checkId: check.check_id,
                identifier: check?.identifier,
                bankName: check.sndr_bname,
                acc: check.sndr_lbacc,
                packageId: packageDetail.packageId,
                errorCode: check?.error_code,
                errorDescription: check?.error_description,
                errorExplanation: check?.error_explanation
              }
            }

            if (txStatus === TRANSACTION_STATUS.PENDING) {
              transactionData = {
                ...transactionData,
                afterBalance: {
                  gcCoin: userDetails.userWallet.gcCoin + parseFloat(packageDetail.gcCoin),
                  scCoin: +userDetails.userWallet.totalScCoin + parseFloat(packageDetail.scCoin)
                }
              }
            }
          }

          if (txStatus !== undefined) {
            transactionDetail = await getOne({
              model: TransactionBankingModel,
              data: { moreDetails: { [Op.contains]: Sequelize.literal(`'{ "checkId" : "${check.check_id}" }'::jsonb`) }, transactionType },
              attributes: ['transactionBankingId', 'status', 'afterBalance', 'isFirstDeposit', 'moreDetails', 'paymentTransactionId'],
              transaction
            })

            if (transactionDetail && ((txStatus !== TRANSACTION_STATUS.PENDING && transactionDetail.status === TRANSACTION_STATUS.PENDING) || ((txStatus !== TRANSACTION_STATUS.SUCCESS && transactionType === TRANSACTION_TYPE.DEPOSIT && [TRANSACTION_STATUS.INPROGRESS, TRANSACTION_STATUS.REFUND].includes(transactionDetail.status))))) {
              await transactionDetail.set({
                paymentTransactionId: check.number,
                afterBalance: afterBalance || transactionDetail.afterBalance,
                status: txStatus,
                isFirstDeposit,
                moreDetails: { ...transactionDetail.moreDetails, errorCode: check?.error_code, errorDescription: check?.error_description, errorExplanation: check?.error_explanation }
              }).save({ transaction })
            } else if (!transactionDetail) {
              transactionData = { ...transactionData, status: txStatus }
              if (!(transactionType === TRANSACTION_TYPE.WITHDRAW && txStatus === TRANSACTION_STATUS.PENDING)) transactionDetail = await TransactionBankingModel.create(transactionData, { transaction })
            }

            if (transactionType === TRANSACTION_TYPE.DEPOSIT) {
              if (txStatus === TRANSACTION_STATUS.PENDING) {
                userDetails.userWallet.scCoin = { ...userDetails.userWallet.scCoin, psc: +(Math.round((+userDetails.userWallet.scCoin?.psc + +packageDetail.scCoin) * 100) / 100).toFixed(2) }
                userDetails.userWallet.gcCoin = +userDetails.userWallet.gcCoin + +packageDetail.gcCoin
                await userDetails.userWallet.save({ transaction })

                if (isFirstDeposit && packageDetail.firstPurchaseApplicable) await awardFirstPurchaseBonus({ userId: userDetails.userId, purchasedSc: packageDetail.scCoin, purchasedGc: packageDetail.gcCoin, sequelizeTransaction: transaction, userWallet: userDetails.userWallet, provider: TRANSACTION_PROVIDER.PAYNOTE })
                if (userDetails.referredBy) await awardReferralBonus({ userDetails, sequelizeTransaction: transaction })
                await awardBoostBonus({ userId: userDetails.userId, purchasedSc: packageDetail.scCoin, purchasedGc: packageDetail.gcCoin, sequelizeTransaction: transaction, userWallet: userDetails.userWallet })

                WalletEmitter.emitUserWalletBalance({
                  scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
                  gcCoin: userDetails.userWallet.gcCoin
                }, userDetails.userId)
              } else if (txStatus === TRANSACTION_STATUS.SUCCESS && !transactionDetail?.moreDetails?.refundId) {
                WalletEmitter.emitTransactionStatus({ transactionId: check.number, status: TRANSACTION_STATUS.SUCCESS }, userDetails.userId)

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
              } else if (txStatus === TRANSACTION_STATUS.CANCELED) {
                WalletEmitter.emitTransactionStatus({ transactionId: check.number, status: TRANSACTION_STATUS.CANCELED }, userDetails.userId)

                if (!userDetails?.moreDetails?.paynotePayment || (userDetails?.moreDetails?.paynotePayment &&
                (userDetails?.moreDetails?.paynotePayment === PROVIDER_ACTION_STATUS.ENABLE && (!userDetails?.moreDetails?.paynoteEnabledAt || (userDetails?.moreDetails?.paynoteEnabledAt && ((new Date(userDetails?.moreDetails?.paynoteEnabledAt).getUTCDate() !== (new Date()).getUTCDate()) ||
                (new Date(userDetails?.moreDetails?.paynoteEnabledAt).getUTCMonth() !== (new Date()).getUTCMonth()) ||
                (new Date(userDetails?.moreDetails?.paynoteEnabledAt).getUTCFullYear() !== (new Date()).getUTCFullYear()))))))) {
                  const failedTransactions = await TransactionBankingModel.count({
                    where: {
                      actioneeId: userDetails.userId,
                      transactionType: TRANSACTION_TYPE.DEPOSIT,
                      status: TRANSACTION_STATUS.CANCELED,
                      paymentMethod: TRANSACTION_PROVIDER.PAYNOTE,
                      updatedAt: {
                        [Op.and]: {
                          [Op.gte]: `${(new Date()).toISOString().substring(0, 10)} 00:00:00.000+00`,
                          [Op.lte]: `${(new Date()).toISOString().substring(0, 10)} 23:59:59.999+00`
                        }
                      }
                    },
                    transaction
                  })

                  if ((failedTransactions >= PAYNOTE_FAILED_TRANSACTION_COUNT)) {
                    await userDetails.set({ moreDetails: { ...userDetails.moreDetails, paynotePayment: PROVIDER_ACTION_STATUS.DISABLE } }).save({ transaction })
                  }
                }
              } else if (check.status.toLowerCase() === STATUS.REFUND_PENDING) {
                if (((+userDetails.userWallet.gcCoin - +transactionDetail.gcCoin) < 0) || ((+userDetails.userWallet.scCoin.psc - +transactionDetail.scCoin) < 0)) {
                  await transaction.rollback()
                  return { success: false, message: 'Coins used by player, cannot void/refund the transaction amount' }
                }

                await userDetails.userWallet.set({
                  gcCoin: +userDetails.userWallet.gcCoin - +transactionDetail.gcCoin,
                  scCoin: { ...userDetails.userWallet.scCoin, psc: +(+userDetails.userWallet.scCoin.psc - +transactionDetail.scCoin).toFixed(2) }
                }).save({ transaction })

                WalletEmitter.emitUserWalletBalance({
                  scCoin: +(Math.round((+userDetails.userWallet.scCoin?.psc + +userDetails.userWallet.scCoin?.bsc + +userDetails.userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
                  gcCoin: userDetails.userWallet.gcCoin
                }, userDetails.userId)
              }
            } else if (transactionType === TRANSACTION_TYPE.WITHDRAW) {
              if (txStatus === TRANSACTION_STATUS.PENDING) txStatus = TRANSACTION_STATUS.INPROGRESS
              await updateEntity({
                model: WithdrawRequestModel,
                data: { status: txStatus, transactionId: check.number },
                values: { transactionId: { [Op.in]: [check.check_id, check.identifier, check.number] } },
                transaction
              })

              if (txStatus === TRANSACTION_STATUS.CANCELED) {
                await userDetails.userWallet.set({ scCoin: { ...userDetails.userWallet.scCoin, wsc: +(Math.round((+userDetails.userWallet.scCoin?.wsc + +check.amount) * 100) / 100).toFixed(2) } }).save({ transaction })

                WalletEmitter.emitUserWalletBalance({
                  scCoin: (Math.round((+userDetails?.userWallet.scCoin?.psc + +userDetails?.userWallet.scCoin?.bsc + +userDetails?.userWallet.scCoin?.wsc + +check.amount) * 100) / 100).toFixed(2),
                  gcCoin: +userDetails?.userWallet.gcCoin
                }, userDetails.userId)
              }
            }
          }
        }
      }

      await transaction.commit()
      return { success: true, message: SUCCESS_MSG.TRANSACTION_SUCCESS }
    } catch (error) {
      await transaction.rollback()
      return { success: false, message: ERROR_MSG.SERVER_ERROR }
    }
  }
}
