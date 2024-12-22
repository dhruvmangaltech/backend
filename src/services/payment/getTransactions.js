import { Op, Sequelize } from 'sequelize'

import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE, PAYMENT_PROVIDER } from '../../utils/constants/constant'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

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
    sumOfAmount: { type: ['object', 'null'] },
    csvDownload: { type: ['string', 'null'] },
    status: {
      type: ['string', 'null'],
      enum: ['pending', 'success', 'canceled', 'failed', 'all', 'void', 'refund', 'inprogress']
    },
    transactionType: {
      type: ['string', 'null'],
      enum: ['deposit', 'withdraw', 'all']
    },
    paymentProvider: {
      type: ['string', 'null'],
      enum: ['triple_a', 'paynote', 'all']
    }
  }
}

const constraints = ajv.compile(schema)

export class GetTransactionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { TransactionBanking: TransactionModel } = this.context.dbModels
    const { pageNo, limit, orderBy, sortBy, startDate, endDate, transactionType, email, status, userId, paymentProvider, csvDownload } = this.args

    let query = {}
    const modelName = 'TransactionBanking'

    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (startDate || endDate) {
        if (startDate) {
          query = {
            ...query,
            [Op.or]: [
              {
                [Op.and]: [
                  { paymentMethod: PAYMENT_PROVIDER.PAYNOTE },
                  Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '>=', new Date(startDate)),
                  Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '<=', new Date(endDate))
                ]
              },
              {
                [Op.and]: [
                  {
                    [Op.or]: [
                      { paymentMethod: null },
                      {
                        paymentMethod: {
                          [Op.ne]: PAYMENT_PROVIDER.PAYNOTE
                        }
                      }
                    ]
                  },
                  Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '>=', new Date(startDate)),
                  Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '<=', new Date(endDate))
                ]
              }
            ]
          }
        } else {
          query = {
            ...query,
            [Op.or]: [
              Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.updated_at`)), '<=', new Date(endDate))
            ]
          }
        }
      }
      if (status && status !== 'all') query = { ...query, status: TRANSACTION_STATUS[status.toUpperCase()] }
      if (email) query = { ...query, actioneeEmail: { [Op.iLike]: `%${email}%` } }
      if (userId) query = { ...query, userId }
      if (transactionType && transactionType !== 'all') query = { ...query, transactionType: { [Op.eq]: TRANSACTION_TYPE[transactionType.toUpperCase()] } }
      if (paymentProvider && paymentProvider !== 'all') query = { ...query, paymentMethod: PAYMENT_PROVIDER[paymentProvider.toUpperCase()] }

      if (csvDownload === 'true') {
        const stream = await this.createStream({ query, orderBy, sortBy, TransactionModel })
        return { stream }
      }

      const transactionDetail = await TransactionModel.findAndCountAll({
        where: query,
        limit: size,
        offset: ((page - 1) * size),
        order: [[orderBy || 'createdAt', sortBy || 'DESC']]
      })
      const sumOfAmount = await TransactionModel.findOne({
        attributes: [
          [Sequelize.literal('SUM(sc_coin)'), 'scCoinSum'],
          [Sequelize.literal('SUM(gc_coin)'), 'gcCoinSum'],
          [Sequelize.literal('SUM(amount)'), 'amount']
        ],
        where: query
      })

      if (transactionDetail?.count > 0) {
        return { transactionDetail, sumOfAmount: { sumScCoin: sumOfAmount.dataValues?.scCoinSum?.toFixed(2), sumGcCoin: sumOfAmount.dataValues?.gcCoinSum.toFixed(2), sumAmount: sumOfAmount.amount?.toFixed(2) }, message: SUCCESS_MSG.GET_SUCCESS }
      } else {
        return { transactionDetail: {}, sumOfAmount: {}, message: SUCCESS_MSG.GET_SUCCESS }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }

  async createStream ({ query, orderBy, sortBy, TransactionModel }) {
    const stream = new Readable({ objectMode: true })

    let offset = 0
    const limit = 300000 // Choose an appropriate chunk size

    stream._read = async () => {
      try {
        const combinedChunk = await this.fetchCasinoData({ query, offset, orderBy, sortBy, TransactionModel, limit })

        if (combinedChunk.length > 0) {
          const modifiedChunk = combinedChunk.map(item => {
            return {
              'Transaction Id': item.transactionBankingId,
              'Payment Id': item?.paymentTransactionId,
              Email: item?.actioneeEmail,
              Amount: item?.amount,
              'Gc Coin': item?.gcCoin,
              'Sc Coin': item?.scCoin,
              'Transaction Type': item?.transactionType,
              'Payment Method': item?.paymentMethod,
              Status: item?.status,
              'Updated At': item?.updatedAt,
              Details: JSON.stringify(item?.moreDetails)
            }
          })

          const json2csv = new Parser()
          const csv = json2csv.parse(modifiedChunk)
          stream.push(csv + '\n')
          offset += limit
        } else {
          // Signal the end of the stream
          stream.push(null)
        }
      } catch (error) {
        // Handle errors
        stream.emit('error', error)
      }
    }

    return stream
  }

  async fetchCasinoData ({ query, offset, orderBy, sortBy, TransactionModel, limit }) {
    const transactionDetail = await TransactionModel.findAll({
      where: query,
      limit,
      offset,
      order: [[orderBy || 'createdAt', sortBy || 'DESC']]
    })
    return transactionDetail
  }
}
