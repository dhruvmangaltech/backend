import axios from 'axios'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import AleaGetGamesService from './getGames.service'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class AleaGetPagesService extends ServiceBase {
  async run () {
    const env =
      config.get('env') !== 'production' ? 'gamesAvailable' : 'gamesReady'
    const query = JSON.stringify({
      query: `{
      ${env}(jurisdictionCode: "CAO", size: 500) {
        page {
          number
          size
          totalPages
          totalElements
        }
      }
    }`,
      variables: {}
    })

    const options = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://customer-api.aleaplay.com/api/graphql',
      headers: {
        Authorization: `Bearer ${config.get('alea.secret_token')}`,
        'Alea-CasinoId': config.get('alea.casino_id'),
        'Content-Type': 'application/json'
      },
      data: query
    }

    try {
      const {
        data: { data: object },
        status
      } = await axios(options)

      const { page: pageDetails } =
        env === 'gamesAvailable' ? object.gamesAvailable : object.gamesReady

      if (status !== 200) return this.addError('ThirdPartyApiErrorType')

      const promiseArray = []; const data = []

      for (let i = 0; i < pageDetails.totalPages; i++) {
        promiseArray.push(this.getGame(i))
      }

      data.push(...await Promise.all(promiseArray))
      const list = []

      data.map((x) => { return list.push(...x) })

      await AleaGetGamesService.execute({ list }, this.context)

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
        data: list
      }
    } catch (error) {
      console.log(error)
      return this.addError('ThirdPartyApiErrorType')
    }
  }

  async getGame (page) {
    const env =
      config.get('env') !== 'production' ? 'gamesAvailable' : 'gamesReady'

    const query = JSON.stringify({
      query: `{
      ${env}(jurisdictionCode: "CAO", size: ${500}, page: ${page}) {
        page {
          number
          size
          totalPages
          totalElements
        }
        results {
          id
          name
          software {
              id
              name
          }
          type
          status
          genre
          jackpot
          freeSpinsCurrencies
          ratio
          rtp
          volatility
          minBet
          maxBet
          maxExposure
          maxWinMultiplier
          lines
          hitFrequency
          buyFeature
          releaseDate
          features
          assetsLink
          thumbnailLinks
          demoAvailable
        }
      }
    }`,
      variables: {}
    })

    const options = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://customer-api.aleaplay.com/api/graphql',
      headers: {
        Authorization: `Bearer ${config.get('alea.secret_token')}`,
        'Alea-CasinoId': config.get('alea.casino_id'),
        'Content-Type': 'application/json'
      },
      data: query
    }

    try {
      const {
        data: { data: object },
        status
      } = await axios(options)

      const { results: data } =
        env === 'gamesAvailable' ? object.gamesAvailable : object.gamesReady

      if (status !== 200) return this.addError('ThirdPartyApiErrorType')

      return data
    } catch (error) {
      console.log('Error while getting games from Alea', error)
      return this.addError('ThirdPartyApiErrorType')
    }
  }
}
