import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    masterCasinoProviderId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    assetsURL: {
      type: 'string',
      format: 'uri'
    }
  },
  required: ['masterCasinoProviderId', 'assetsURL']
}
const constraints = ajv.compile(schema)

export class AddGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { file } = this.context.req
    let { masterCasinoProviderId, assetsURL } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      if (!(+masterCasinoProviderId)) {
        return this.addError('InvalidIdErrorType')
      }
      if (!assetsURL) {
        return this.addError('InvalidAssetURLErrorType')
      }
      assetsURL = assetsURL.replace(/\/$/, '')
      if (!file) {
        this.addError('FileNotFoundErrorType')
      }
      if (file && file.mimetype) {
        const fileType = file.mimetype.split('/')[1]
        const supportedFileType = ['json']

        if (!supportedFileType.includes(fileType)) {
          this.addError('FileTypeNotSupportedErrorType')
        }
      }
      const isProviderExist = await getOne({ model: db.MasterCasinoProvider, data: { masterCasinoProviderId }, attributes: ['masterCasinoProviderId', 'isActive'], transaction })
      if (!isProviderExist) return this.addError('CasinoProviderNotFoundErrorType')

      const gameArray = []
      const gameList = JSON.parse(file.buffer.toString())
      gameList.map(game => {
        const gameObj = {}
        gameObj.masterCasinoProviderId = isProviderExist.masterCasinoProviderId
        gameObj.operatorStatus = isProviderExist.isActive
        gameObj.name = game['Game Name']
        gameObj.volatilityRating = game['Volatility (Rating)']
        gameObj.identifier = game['Game ID']
        gameObj.isActive = true
        gameObj.thumbnailUrl = `${assetsURL}/${game['Game ID']}.png`
        gameObj.moreDetails = {
          credit: game['Credits (Bets)'],
          maxWin: game['Max Win (Exposure)'],
          RTP: game.RTP,
          volatilityInPercentage: game['Volatility (%)'],
          hitRate: game['Hit Rate']
        }
        gameArray.push(gameObj)
        return 0
      }
      )

      await db.MasterCasinoGame.bulkCreate(gameArray, transaction)
      transaction.commit()
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      transaction.Rollback()
      console.log(error)
    }
  }
}
