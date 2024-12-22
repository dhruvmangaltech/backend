import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import axios from 'axios'
import config from '../../configs/app.config'

export class AddGamesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterGameCategory: MasterGameCategoryModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const headers = {
        Authorization: config.get('casimbaConfig.casimbaAuthKey')
      }

      const gameListing = await axios.get(`${config.get('casimbaConfig.casimbaGameUrl')}/gamelist/${config.get('casimbaConfig.casimbaSkinCode')}`, { headers })

      if (gameListing?.status !== 200) {
        return this.addError('')
      }

      const gamesArray = gameListing?.data

      let aggregatorId, providerId
      const isAggregatorExist = await MasterGameAggregatorModel.findOne({ where: { name: 'casimba' } })

      if (!isAggregatorExist) {
        const createAggregator = await MasterGameAggregatorModel.create({ name: 'casimba' })
        aggregatorId = createAggregator.masterGameAggregatorId
      } else {
        aggregatorId = isAggregatorExist?.masterGameAggregatorId
      }

      const isProviderExist = await MasterCasinoProviderModel.findOne({ where: { name: 'casimba', masterGameAggregatorId: aggregatorId } })
      if (!isProviderExist) {
        const createProvider = await MasterCasinoProviderModel.create({ name: 'casimba', masterGameAggregatorId: aggregatorId })
        providerId = createProvider.masterCasinoProviderId
      } else {
        providerId = isProviderExist?.masterCasinoProviderId
      }

      for (const data of gamesArray) {
        if (data.category === 'Slots' || data.category === 'Slot') data.category = 'Slot'
        const name = {
          EN: data.category
        }
        const isCategoryExist = await MasterGameCategoryModel.findOne({
          where: {
            'name.EN': data.category
          }
        })
        if (!isCategoryExist) {
          await MasterGameCategoryModel.create({ name })
        }
        const isGameExist = await MasterCasinoGameModel.findOne({ where: { identifier: data.gameID + '' } })
        if (!isGameExist) {
          await MasterCasinoGameModel.create({
            name: data.gameName,
            identifier: data.gameID,
            masterCasinoProviderId: providerId,
            moreDetails: data,
            returnToPlayer: data.gameInfo.rtp ? data.gameInfo.rtp : null,
            isDemoSupported: true
          })
        }
      }
      await transaction.commit()

      return SUCCESS_MSG.UPDATE_SUCCESS
    } catch (error) {
      console.log(error)
      await transaction.rollback()
    }
  }
}
