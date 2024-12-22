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
      const gameListing = await axios.get(`${config.get('hacksawConfig.hacksawGameUrl')}/${config.get('hacksawConfig.hacksawPartnerId')}/gameList`)
      if (gameListing?.status !== 200) {
        return this.addError('HacksawError')
      }

      const gamesArray = gameListing?.data?.data

      let aggregatorId, providerId
      const isAggregatorExist = await MasterGameAggregatorModel.findOne({ where: { name: 'hacksaw' } })

      if (!isAggregatorExist) {
        const createAggregator = await MasterGameAggregatorModel.create({ name: 'hacksaw' })
        aggregatorId = createAggregator.masterGameAggregatorId
      } else {
        aggregatorId = isAggregatorExist?.masterGameAggregatorId
      }

      const isProviderExist = await MasterCasinoProviderModel.findOne({ where: { name: 'hacksaw', masterGameAggregatorId: aggregatorId } })
      if (!isProviderExist) {
        const createProvider = await MasterCasinoProviderModel.create({ name: 'hacksaw', masterGameAggregatorId: aggregatorId })
        providerId = createProvider.masterCasinoProviderId
      } else {
        providerId = isProviderExist?.masterCasinoProviderId
      }

      for (const data of gamesArray) {
        const name = {
          EN: data.gameType
        }
        // let categoryId
        const isCategoryExist = await MasterGameCategoryModel.findOne({
          where: {
            'name.EN': data.gameType
          }
        })
        if (!isCategoryExist) {
          await MasterGameCategoryModel.create({ name })
          // categoryId = createCategory.masterGameCategoryId
        } else {
          // categoryId = isCategoryExist.masterGameCategoryId
        }
        const isGameExist = await MasterCasinoGameModel.findOne({ where: { identifier: data.gameId + '' } })
        if (!isGameExist) {
          await MasterCasinoGameModel.create({
            name: data.gameName,
            identifier: +data.gameId,
            masterCasinoProviderId: providerId,
            moreDetails: data?.jackpot,
            isDemoSupported: true,
            returnToPlayer: data?.rtpVariations[0]?.isDefault ? data?.rtpVariations[0]?.theoreticalRTP : null
          })
        } else {
          isGameExist.set(
            {
              returnToPlayer: data?.rtpVariations[0]?.isDefault ? data?.rtpVariations[0]?.theoreticalRTP : null
            }
          )
          await isGameExist.save()
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
