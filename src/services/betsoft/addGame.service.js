import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import axios from 'axios'
import { transform } from 'camaro'
import config from '../../configs/app.config'

export class BetSoftAddGameService extends ServiceBase {
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
      const { data: gameList } = await axios.get(
        `${config.get(
          'betsoftConfig.betsoftGameUrl'
        )}/gamelist.do?bankId=${config.get('betsoftConfig.betsoftBankId')}`
      )

      if (!gameList) {
        return this.addError('')
      }

      const gamesArray = await transform(gameList, [
        'GAMESSUITES/SUITES/SUITE',
        {
          name: '@NAME',
          id: '@ID',

          games: [
            'GAMES/GAME',
            {
              name: '@NAME',
              id: '@ID',
              imageUrl: '@IMAGEURL'
            }
          ]
        }
      ])

      let aggregatorId, providerId
      const isAggregatorExist = await MasterGameAggregatorModel.findOne({
        where: { name: 'betsoft' },
        transaction
      })

      if (!isAggregatorExist) {
        const createAggregator = await MasterGameAggregatorModel.create(
          {
            name: 'betsoft'
          },
          { transaction }
        )
        aggregatorId = createAggregator.masterGameAggregatorId
      } else {
        aggregatorId = isAggregatorExist?.masterGameAggregatorId
      }

      const isProviderExist = await MasterCasinoProviderModel.findOne({
        where: { name: 'betsoft', masterGameAggregatorId: aggregatorId },
        transaction
      })

      if (!isProviderExist) {
        const createProvider = await MasterCasinoProviderModel.create(
          {
            name: 'betsoft',
            masterGameAggregatorId: aggregatorId
          },
          { transaction }
        )
        providerId = createProvider.masterCasinoProviderId
      } else {
        providerId = isProviderExist?.masterCasinoProviderId
      }

      for (const data of gamesArray) {
        if (data.name === 'Slots' || data.name === 'Slot') data.name = 'Slot'
        const name = {
          EN: data.name
        }

        const isCategoryExist = await MasterGameCategoryModel.findOne({
          where: {
            'name.EN': data.name
          },
          transaction
        })
        if (!isCategoryExist) {
          await MasterGameCategoryModel.create({ name })
        }
        for (const game of data.games) {
          const isGameExist = await MasterCasinoGameModel.findOne({
            where: {
              identifier: game.id + '',
              masterCasinoProviderId: providerId
            },
            transaction
          })

          if (!isGameExist) {
            await MasterCasinoGameModel.create(
              {
                name: game.name,
                identifier: game.id + '',
                masterCasinoProviderId: providerId,
                moreDetails: game,
                isDemoSupported: true
              },
              { transaction }
            )
          }
        }
      }

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType')
    }
  }
}
