import { Op, Sequelize } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { convertToCsv, getCsvFileName } from '../../libs/email'
import { filterByDate, pageValidation } from '../../utils/common'
import { ACTION, COIN_TYPE, CASINO_TRANSACTION_STATUS, BONUS_TYPE, WAGERING_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    userId: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'] },
    sumOfAmount: { type: 'object' },
    currencyCode: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: ['pending', 'completed', 'failed', 'rollback', 'all', 'null', '']
    },
    transactionType: {
      type: ['string', 'null'],
      enum: ['bet', 'win', 'rollback', 'rollbackbeforebetwin', 'freespins', '', 'null', 'all', 'lost', 'bonus']
    },
    amountType: {
      type: ['string', 'null'],
      enum: ['0', '1', 'all']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetCasinoTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      pageNo, limit, orderBy, sortBy, startDate, endDate, currencyCode, transactionType, email,
      status, csvDownload, userId, amountType
    } = this.args

    let query = {}
    let walletQuery = {}
    let userQuery = {}

    try {
      let { page, size } = pageValidation(pageNo, limit)
      const CasinoTransaction = 'CasinoTransaction'
      if (csvDownload) {
        page = null
        size = null
      }

      if (startDate || endDate) query = filterByDate(query, startDate, endDate, CasinoTransaction)
      if (status && status !== 'all') query = { ...query, status: CASINO_TRANSACTION_STATUS[status.toUpperCase()] }
      if (email) userQuery = { ...userQuery, email: { [Op.iLike]: `%${email}%` } }
      if (userId) query = { ...query, userId }
      if (currencyCode) walletQuery = { ...walletQuery, currencyCode }
      if (transactionType && transactionType === 'bonus') {
        query = { ...query, actionType: { [Op.in]: [WAGERING_TYPE.BONUS, BONUS_TYPE.DAILY_BONUS, BONUS_TYPE.MONTHLY_BONUS, BONUS_TYPE.WELCOME_BONUS, BONUS_TYPE.FIRST_PURCHASE_BONUS, BONUS_TYPE.PSP_BONUS, BONUS_TYPE.WEEKLY_RAKEBACK_BONUS, BONUS_TYPE.REFERRAL_BONUS, BONUS_TYPE.BOOST_BONUS, BONUS_TYPE.SPIN_WHEEL] } }
      } else if (transactionType && transactionType !== 'all') {
        query = { ...query, actionType: { [Op.eq]: ACTION[transactionType.toUpperCase()] } }
      }
      if (amountType && amountType !== 'all') query = { ...query, amountType: parseInt(amountType) }

      const transactionDetail = await db.CasinoTransaction.findAndCountAll({
        where: query,
        attributes: { exclude: ['actionId'] },
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderBy || 'createdAt', sortBy || 'DESC']],
        include: [
          { model: db.Wallet, attributes: [], where: walletQuery },
          { model: db.User, attributes: ['email', 'currencyCode'], where: userQuery }
        ]
      })
      await Promise.all([transactionDetail.rows.map(async (list, index) => {
        if (list.amountType === null) {
          let amountType = COIN_TYPE.SC
          if (parseFloat(list.gc) > 0 & parseFloat(list.sc) <= 0) {
            amountType = COIN_TYPE.GC
          } else if (parseFloat(list.gc) > 0 & parseFloat(list.sc) > 0) {
            amountType = COIN_TYPE.SC_GC
          }
          transactionDetail.rows[index].amountType = amountType
        }
      })])
      if (csvDownload && transactionDetail.count !== 0) {
        const fields = transactionDetail.rows[0]._options.attributes
        fields.push('User.email')
        const csvData = convertToCsv({
          fields,
          data: transactionDetail.rows
        })

        return { csv: true, csvData, fileName: getCsvFileName() }
      }
      const sumOfAmount = await db.CasinoTransaction.findOne({
        where: query,
        attributes: [
          [Sequelize.literal('SUM(CASE WHEN "CasinoTransaction"."amount_type" = 1 THEN "CasinoTransaction"."amount" ELSE 0 END)'), 'scCoinSum'],
          [Sequelize.literal('SUM(CASE WHEN "CasinoTransaction"."amount_type" = 0 THEN "CasinoTransaction"."amount" ELSE 0 END)'), 'gcCoinSum'],
          [Sequelize.literal('SUM(sc)'), 'sc'],
          [Sequelize.literal('SUM(gc)'), 'gc']
        ],
        include: [
          { model: db.Wallet, attributes: [], where: walletQuery },
          { model: db.User, attributes: [], where: userQuery }
        ],
        group: [] // Remove group option since you're using aggregate functions
      })

      return { transactionDetail, sumOfAmount: { sumScCoin: (+sumOfAmount.dataValues?.scCoinSum + +sumOfAmount.dataValues?.sc)?.toFixed(2), sumGcCoin: (+sumOfAmount.dataValues?.gcCoinSum + sumOfAmount.dataValues?.gc)?.toFixed(2) }, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
