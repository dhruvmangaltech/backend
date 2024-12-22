import ajv from '../../libs/ajv'
import { Op, Sequelize } from 'sequelize'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Readable } from 'stream'
import { Parser } from 'json2csv'
import { BONUS_TYPE, WAGERING_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string', pattern: '^[0-9]+$' },
    status: { type: 'string' },
    pageNo: { type: 'string', pattern: '^[0-9]+$' },
    limit: { type: 'string', pattern: '^[0-9]+$' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    coinType: { type: 'string' },
    transaction: { type: 'string' },
    gameProvider: { type: 'string' },
    activityType: { type: 'string' },
    action: { type: 'string' },
    providerName: { type: 'string' },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'null', 'false'] }
  },
  required: ['userId', 'startDate', 'endDate', 'pageNo', 'limit']
}
const constraints = ajv.compile(schema)

export class GetUserActivityService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, pageNo, limit, startDate, endDate, action, transaction, coinType, providerName, csvDownload } = this.args

    const offset = (pageNo - 1) * limit

    const { TransactionBanking, CasinoTransaction, MasterCasinoGame, MasterCasinoProvider } = db

    let require = true

    let bankingTransactions = []
    let casinoTransactions = []
    const startOfDay = new Date(startDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    const bankingFilters = {
      createdAt: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay
      },
      actioneeId: +userId
    }

    const casinoBankingFilters = {
      createdAt: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay
      },
      userId
    }

    if (action !== 'all' && action) {
      if (action.includes('bonus')) {
        require = false
      }
      if (action === 'bonus') {
        casinoBankingFilters.actionType = { [Op.in]: [WAGERING_TYPE.BONUS, BONUS_TYPE.DAILY_BONUS, BONUS_TYPE.MONTHLY_BONUS, BONUS_TYPE.WELCOME_BONUS, BONUS_TYPE.FIRST_PURCHASE_BONUS, BONUS_TYPE.PSP_BONUS, BONUS_TYPE.WEEKLY_RAKEBACK_BONUS, BONUS_TYPE.REFERRAL_BONUS, BONUS_TYPE.BOOST_BONUS, BONUS_TYPE.SPIN_WHEEL] }
        bankingFilters.transactionType = action
      } else {
        bankingFilters.transactionType = action
        casinoBankingFilters.actionType = action
      }
    }
    const gameProvider = {}
    if (providerName !== 'all' && providerName) {
      gameProvider.name = providerName
      bankingFilters.paymentMethod = providerName
    }

    if (coinType !== 'all' && coinType) {
      const coinValue = coinType === 'gc' ? 0 : 1
      casinoBankingFilters.amountType = coinValue
    }
    let isBanking = true
    let isCasino = true

    if (transaction !== 'all' && transaction) {
      if (transaction === 'banking') {
        isCasino = false
        casinoTransactions = []
      } else {
        isBanking = false
        bankingTransactions = []
      }
    }
    let totalBankingCount = 0
    let totalCasinoCount = 0
    if (csvDownload === 'true') {
      const stream = await this.createStream({ TransactionBanking, bankingFilters, casinoBankingFilters, CasinoTransaction, MasterCasinoGame, MasterCasinoProvider, gameProvider })
      return { stream }
    }
    if (isBanking) { totalBankingCount = await TransactionBanking.count({ where: bankingFilters }) }

    if (isCasino) {
      totalCasinoCount = await CasinoTransaction.count({
        where: casinoBankingFilters,
        include: [
          {
            model: MasterCasinoGame,
            attributes: [],
            include: [
              {
                model: MasterCasinoProvider,
                where: gameProvider,
                attributes: [],
                required: require
              }
            ],
            required: require
          }
        ]
      })
    }

    const bankingLimit = Math.min(limit, totalBankingCount - offset)
    const casinoLimit = Math.max(0, Math.min(limit - bankingLimit, totalCasinoCount - (offset - totalBankingCount)))
    if (bankingLimit > 0 && isBanking) {
      bankingTransactions = await TransactionBanking.findAll({
        where: bankingFilters,
        order: [['createdAt', 'DESC']],
        limit: bankingLimit,
        offset,
        raw: true
      })
    }
    // MasterCasinoProvider

    if (casinoLimit > 0 && isCasino) {
      casinoTransactions = await CasinoTransaction.findAll({
        where: casinoBankingFilters,
        order: [['createdAt', 'DESC']],
        limit: casinoLimit,
        attributes: [
          'casinoTransactionId',
          'userId',
          'walletId',
          'gameIdentifier',
          'gameId',
          'actionType',
          'actionId',
          'amount',
          'status',
          'currencyCode',
          'amountType',
          'beforeBalance',
          'afterBalance',
          'elasticUpdated',
          'isSticky',
          'userBonusId',
          'transactionId',
          'roundId',
          'roundStatus',
          'device',
          'sc',
          'gc',
          'moreDetails',
          'createdAt',
          [Sequelize.col('MasterCasinoGame.name'), 'gameName'],
          [Sequelize.col('MasterCasinoGame.MasterCasinoProvider.name'), 'providerName']
        ],
        offset: Math.max(0, offset - totalBankingCount),
        include: [
          {
            model: MasterCasinoGame,
            attributes: [],
            include: [
              {
                model: MasterCasinoProvider,
                where: gameProvider,
                attributes: [],
                required: require
              }
            ],
            required: require
          }
        ],
        raw: true
      })
    }

    const combinedTransactions = [...bankingTransactions, ...casinoTransactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    const totalCount = totalBankingCount + totalCasinoCount
    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      data: { count: totalCount, rows: combinedTransactions, totalPages },
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }

  catch (error) {
    this.addError('InternalServerErrorType', error)
  }

  async createStream ({ casinoBankingFilters, CasinoTransaction, MasterCasinoGame, MasterCasinoProvider, gameProvider, TransactionBanking, bankingFilters }) {
    const stream = new Readable({ objectMode: true })

    let offset = 0
    const limit = 300000 // Choose an appropriate chunk size

    stream._read = async () => {
      try {
        const combinedChunk = await this.fetchCasinoData({
          TransactionBanking,
          bankingFilters,
          casinoBankingFilters,
          CasinoTransaction,
          MasterCasinoGame,
          MasterCasinoProvider,
          gameProvider,
          offset,
          limit
        })

        if (combinedChunk.length > 0) {
          const modifiedChunk = combinedChunk.map(item => {
            // Example: Change 'gameName' to 'Game Name'
            return { 'Game Name': item.gameName, userId: item.userId }
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

  async fetchCasinoData ({ casinoBankingFilters, CasinoTransaction, MasterCasinoGame, MasterCasinoProvider, gameProvider, TransactionBanking, bankingFilters, offset, limit }) {
    const casinoTransactions = await CasinoTransaction.findAll({
      where: casinoBankingFilters,
      order: [['createdAt', 'ASC']],
      limit: limit,
      attributes: [
        'casinoTransactionId',
        'userId',
        'walletId',
        'gameIdentifier',
        'gameId',
        'actionType',
        'actionId',
        'amount',
        'status',
        'currencyCode',
        'amountType',
        'beforeBalance',
        'afterBalance',
        'elasticUpdated',
        'isSticky',
        'userBonusId',
        'transactionId',
        'roundId',
        'roundStatus',
        'device',
        'sc',
        'gc',
        'moreDetails',
        'createdAt',
        [Sequelize.col('MasterCasinoGame.name'), 'gameName'],
        [Sequelize.col('MasterCasinoGame.MasterCasinoProvider.name'), 'providerName']
      ],
      offset,
      include: [
        {
          model: MasterCasinoGame,
          attributes: [],
          include: [
            {
              model: MasterCasinoProvider,
              where: gameProvider,
              attributes: [],
              required: require
            }
          ],
          required: require
        }
      ],
      raw: true
    })
    const bankingTransactions = await TransactionBanking.findAll({
      where: bankingFilters,
      order: [['createdAt', 'ASC']],
      limit,
      offset,
      raw: true
    })

    const combinedTransactions = [...bankingTransactions, ...casinoTransactions].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )
    return combinedTransactions
  }
}
