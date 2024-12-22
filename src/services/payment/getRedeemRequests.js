import { Op, Sequelize } from 'sequelize'

import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterByDate, pageValidation } from '../../utils/common'
import { TRANSACTION_STATUS, PAYMENT_PROVIDER, TRANSACTION_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: ['pending', 'success', 'canceled', 'all', 'inprogress']
    },
    paymentProvider: {
      type: ['string', 'null'],
      enum: ['triple_a', 'paynote', 'all']
    }
  }
}

const constraints = ajv.compile(schema)

export class GetRedeemRequestsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { WithdrawRequest: WithdrawRequestModel } = this.context.dbModels
    const { pageNo, limit, orderBy, sortBy, startDate, endDate, email, status, userId, paymentProvider } = this.args

    let query = {}
    const modelName = 'WithdrawRequest'

    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (startDate || endDate) query = filterByDate(query, startDate, endDate, modelName)
      if (status && status !== 'all') query = { ...query, status: TRANSACTION_STATUS[status.toUpperCase()] }
      if (email) query = { ...query, email: { [Op.iLike]: `%${email}%` } }
      if (userId) query = { ...query, userId }
      if (paymentProvider && paymentProvider !== 'all') query = { ...query, paymentProvider: PAYMENT_PROVIDER[paymentProvider.toUpperCase()] }

      const requestDetails = await WithdrawRequestModel.findAndCountAll({
        where: query,
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderBy || 'createdAt', sortBy || 'DESC']],
        attributes: {
          include: [[Sequelize.literal(`CASE WHEN "WithdrawRequest"."status" = ${TRANSACTION_STATUS.PENDING} THEN (SELECT COUNT(transaction_banking_id) FROM public.transaction_bankings WHERE status = ${TRANSACTION_STATUS.CANCELED} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}'
          AND "WithdrawRequest"."user_id" = transaction_bankings.actionee_id AND "WithdrawRequest"."payment_provider" = transaction_bankings.payment_method AND transaction_bankings.updated_at BETWEEN "WithdrawRequest"."created_at"::date - INTERVAL '1 day' AND "WithdrawRequest"."created_at") ELSE 0 END`), 'failedCount'],
          [Sequelize.literal(`CASE WHEN "WithdrawRequest"."status" = ${TRANSACTION_STATUS.PENDING} THEN (SELECT COUNT(transaction_banking_id) FROM public.transaction_bankings WHERE status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}'
          AND "WithdrawRequest"."user_id" = transaction_bankings.actionee_id AND "WithdrawRequest"."payment_provider" = transaction_bankings.payment_method AND transaction_bankings.updated_at BETWEEN "WithdrawRequest"."created_at"::date - INTERVAL '1 day' AND "WithdrawRequest"."created_at") ELSE 0 END`), 'successCount']]
        }
      })

      return { requestDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
