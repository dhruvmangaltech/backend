import { Op, Sequelize } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { getAll, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { PROVIDER_ACTION_STATUS } from '../../utils/constants/payment'
import { DOCUMENTS, RESPONSIBLE_GAMBLING_TYPE, STATUS, STATUS_VALUE, TICKET_STATUS, TICKET_TYPE, USER_ACTIVITIES_TYPE, BONUS_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'string' },
    userType: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserByIdService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId } = this.args
    if (!(+userId)) {
      return this.addError('InvalidIdErrorType')
    }
    const query = { userId }

    try {
      const user = await getOne({
        model: db.User,
        data: query,
        attributes: {
          exclude: ['password']
        },
        include: [
          { model: db.Wallet, as: 'userWallet' },
          { model: db.Limit, as: 'userLimit' },
          {
            model: db.ResponsibleGambling,
            as: 'responsibleGambling',
            where: {
              status: '1'
            },
            required: false
          },
          { model: db.UserActivities, as: 'userActivity', attributes: ['ipAddress'], where: { activityType: { [Op.in]: [USER_ACTIVITIES_TYPE.LOGIN, USER_ACTIVITIES_TYPE.LOGOUT] } }, order: [['userActivityId', 'DESC']], limit: 1 },
          { model: db.UserVipTier, as: ['userVipTier'], where: { active: true }, include: [{ model: db.VipTier, attributes: ['name'] }] }
        ]
      })

      if (!user) {
        return this.addError('UserNotExistErrorType')
      }

      if (!user.dataValues.isEmailVerified) {
        user.dataValues.activationLink = config.get().userFrontendUrl + '/user/verifyEmail?token=' + user.dataValues.emailToken
      }

      const ticketCounts = await db.UserTickets.findAll({
        where: { playerId: userId, status: TICKET_STATUS.PENDING },
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN ticket_type = '${TICKET_TYPE.VERIFICATION}' THEN 1 ELSE NULL END`)), 'userPendingVerificationTickets'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN ticket_type = '${TICKET_TYPE.REDEMPTION}' THEN 1 ELSE NULL END`)), 'userPendingRedemptionTickets'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN ticket_type = '${TICKET_TYPE.EXPIRY}' THEN 1 ELSE NULL END`)), 'userPendingExpiryTickets'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN ticket_type = '${TICKET_TYPE.FRAUD}' THEN 1 ELSE NULL END`)), 'userPendingFraudTickets']
        ],
        raw: true
      })

      const referralBonusData = await db.CasinoTransaction.count({
        col: 'casino_transaction_id',
        where: {
          userId,
          actionType: BONUS_TYPE.REFERRAL_BONUS
        }
      })

      user.dataValues.userPendingVerificationTickets = ticketCounts?.[0]?.userPendingVerificationTickets
      user.dataValues.userPendingRedemptionTickets = ticketCounts?.[0]?.userPendingRedemptionTickets
      user.dataValues.userPendingFraudTickets = ticketCounts?.[0]?.userPendingFraudTickets
      user.dataValues.userPendingExpiryTickets = ticketCounts?.[0]?.userPendingExpiryTickets
      user.dataValues.referralBonusCount = referralBonusData

      const userDocs = await getAll({
        model: db.UserDocument,
        data: { documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID, DOCUMENTS.BANK_CHECKING] }, userId },
        order: [['documentName', 'ASC']],
        attributes: ['documentUrl', 'documentName', 'status'],
        raw: true
      })

      user.dataValues.profileStatus = STATUS_VALUE.PENDING
      user.dataValues.bankStatus = STATUS_VALUE.PENDING

      if (userDocs?.length) {
        if (userDocs[0]?.documentName === DOCUMENTS.ADDRESS) {
          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
        } else if (userDocs[0]?.documentName === DOCUMENTS.ID) {
          user.dataValues.idProof = userDocs[0].documentUrl.slice(-1)[0]
        } else if (userDocs[0]?.documentName === DOCUMENTS.BANK_CHECKING && userDocs[0].status === STATUS.APPROVED) {
          user.dataValues.bankStatus = STATUS_VALUE.APPROVED
        }
      }

      if (userDocs?.length && userDocs?.length === 3) {
        if (userDocs[0].status === STATUS.APPROVED && userDocs[2].status === STATUS.APPROVED) user.dataValues.profileStatus = STATUS_VALUE.APPROVED
        else if (userDocs[0].status === STATUS.REJECTED || userDocs[2].status === STATUS.REJECTED) user.dataValues.profileStatus = STATUS_VALUE.REJECTED
        else user.dataValues.profileStatus = STATUS_VALUE.REQUESTED

        user.dataValues.idProof = userDocs[2].documentUrl.slice(-1)[0]

        if (userDocs[1].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
        else if (userDocs[1].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED
        else user.dataValues.bankStatus = STATUS_VALUE.REQUESTED
      } else if (userDocs?.length && userDocs?.length === 2) {
        if (userDocs[0].documentName === DOCUMENTS.ADDRESS && userDocs[1].documentName === DOCUMENTS.ID) {
          if (userDocs[0].status === STATUS.APPROVED && userDocs[1].status === STATUS.APPROVED) user.dataValues.profileStatus = STATUS_VALUE.APPROVED
          else if (userDocs[0].status === STATUS.REJECTED || userDocs[1].status === STATUS.REJECTED) user.dataValues.profileStatus = STATUS_VALUE.REJECTED
          else user.dataValues.profileStatus = STATUS_VALUE.REQUESTED

          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
          user.dataValues.idProof = userDocs[1].documentUrl.slice(-1)[0]
        } if (userDocs[0].documentName === DOCUMENTS.ADDRESS && userDocs[1].documentName === DOCUMENTS.BANK_CHECKING) {
          if (userDocs[1].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
          else if (userDocs[1].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED

          user.dataValues.addressProof = userDocs[0].documentUrl.slice(-1)[0]
        } if (userDocs[0].documentName === DOCUMENTS.BANK_CHECKING && userDocs[1].documentName === DOCUMENTS.ID) {
          if (userDocs[0].status === STATUS.APPROVED) user.dataValues.bankStatus = STATUS_VALUE.APPROVED
          else if (userDocs[0].status === STATUS.REJECTED) user.dataValues.bankStatus = STATUS_VALUE.REJECTED

          user.dataValues.idProof = userDocs[1].documentUrl.slice(-1)[0]
        }
      }

      if (user.responsibleGambling.length !== 0) {
        for (const rg of user.responsibleGambling) {
          if (rg.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION && rg.selfExclusion) {
            user.dataValues.RG = 'self exclusion'
            break
          } else if (rg.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK && new Date(rg.timeBreakDuration) > new Date()) {
            user.dataValues.RG = 'Take a break'
            break
          } else user.dataValues.RG = 'NO'
          // else if (rg.responsibleGamblingType === RESPONSIBLE_GAMBLING_TYPE.TIME) {
          //   user.dataValues.RG = 'Limit'
          //   break
          // }
        }
      } else user.dataValues.RG = 'NO'

      user.dataValues.userVipTierName = user.UserVipTiers[0].VipTier.name
      user.dataValues.paynotePayment = user?.moreDetails?.paynotePayment || PROVIDER_ACTION_STATUS.ENABLE
      user.dataValues.tripleAPayment = user?.moreDetails?.tripleAPayment || PROVIDER_ACTION_STATUS.ENABLE
      user.dataValues.prizeoutPayment = user?.moreDetails?.prizeoutPayment || PROVIDER_ACTION_STATUS.ENABLE

      delete user.dataValues.UserVipTiers
      delete user.dataValues.responsibleGambling
      delete user.dataValues.emailToken
      return { user, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
