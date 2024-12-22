import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getAll, getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, filterByName } from '../../utils/common'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    masterGameSubCategoryId: {
      type: ['string', 'null']
    },
    bonusId: {
      type: ['string', 'null']
    },
    providerId: {
      type: ['string', 'null']
    },
    freespins: {
      type: ['string', 'null'],
      enum: ['true', '', 'null']
    },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] },
    isActive: {
      type: ['string', 'null'],
      enum: ['true', 'false', 'all']
    },
    flag: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetCasinoGamesService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      orderBy = 'createdAt', sort = 'DESC', limit, pageNo, flag, isActive, search, masterGameSubCategoryId, providerId, freespins, bonusId
    } = this.args

    const model = db.MasterCasinoGame
    const include = masterGameSubCategoryId
      ? [
        {
          model: db.GameSubcategary,
          include: [
            {
              model: db.MasterGameSubCategory,
              attributes: ['name', 'isActive'],
              include: [
                {
                  model: db.MasterGameCategory,
                  attributes: ['name', 'isActive', 'masterGameCategoryId']
                }
              ]
            }
          ]
        }
      ]
      // : [
      //     {
      //       model: db.MasterCasinoGamesThumbnail,
      //       attributes: ['thumbnail_type', 'thumbnail']
      //     }
      //   ]
      : null
    let casinoGames, page, size, query
    try {
      if (pageNo && limit) {
        const values = pageValidation(pageNo, limit)
        page = values.page
        size = values.size
      }

      if (search) query = filterByName(query, search)
      if (isActive && (isActive !== 'all')) query = { ...query, isActive }

      if (masterGameSubCategoryId) {
        include[0].required = true
        include[0].where = { masterGameSubCategoryId }
        const categoryGames = await getAll({
          model: model,
          include,
          attributes: ['masterCasinoGameId', 'identifier']
        })
        const result = await categoryGames.map(x => x.masterCasinoGameId)
        if (flag === 'true') {
          query = {
            ...query,
            masterCasinoGameId: { [Op.in]: result }
          }
        } else {
          include[0].required = false
          include[0].where = { masterGameSubCategoryId }
          query = {
            ...query,
            masterCasinoGameId: { [Op.notIn]: result }
          }
        }
      }
      if (providerId) query = { ...query, masterCasinoProviderId: providerId }
      if (freespins) {
        if (bonusId) {
          const gameList = await getOne({
            model: db.Bonus,
            data: { bonusId },
            attributes: ['gameIds']
          })

          if (!gameList) return this.addError('BonusNotFoundErrorType')
          query = { ...query, masterCasinoGameId: { [Op.notIn]: gameList.gameIds } }
        }
        query = { ...query, hasFreespins: true }
      }

      if (page && size) {
        casinoGames = await model.findAndCountAll({
          where: query,
          order: [[orderBy, sort]],
          limit: size,
          offset: ((page - 1) * size),
          include
        })
      } else {
        casinoGames = await getAll({
          model,
          data: query,
          order: [[orderBy, sort]],
          include
        })
      }
      if (!casinoGames) return this.addError('GameNotFoundErrorType')
      let result = []
      if (casinoGames && flag === 'true' && masterGameSubCategoryId) {
        for (const value of casinoGames) {
          value.orderId = value.GameSubcategaries[0].orderId
          result.push(value)
        }

        result = result.sort(function (a, b) {
          return a.orderId - b.orderId
        })
        return { casinoGames: result, message: SUCCESS_MSG.GET_SUCCESS }
      }

      const casinoGamesArray = []
      for (const casinoGamesImages of casinoGames.rows) {
        if (casinoGamesImages.thumbnailUrl && casinoGamesImages.thumbnailUrl.indexOf('https://') === -1) {
          casinoGamesImages.thumbnailUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${casinoGamesImages.thumbnailUrl}`
        }
        // if (casinoGamesImages.MasterCasinoGamesThumbnails) {
        //   casinoGamesImages.MasterCasinoGamesThumbnails = await Promise.all(
        //     casinoGamesImages.MasterCasinoGamesThumbnails.map((game) => {
        //       game.thumbnail = `${s3Config.S3_DOMAIN_KEY_PREFIX}${game.thumbnail}`
        //       return game
        //     })
        //   )
        // }
        if (casinoGamesImages.imageUrl) casinoGamesImages.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${casinoGamesImages.imageUrl}`
        casinoGamesArray.push(casinoGamesImages)
      }
      casinoGames.rows = casinoGamesArray

      const casinoGamesArrayList = []
      await Promise.all(casinoGames.rows.map(async (list) => {
        const SubCategoryGames = await getAll({
          model: db.GameSubcategary,
          data: { masterCasinoGameId: list.masterCasinoGameId },
          attributes: ['masterGameSubCategoryId']
        })
        casinoGamesArrayList.push({ ...list.dataValues, subCategoryGames: SubCategoryGames })
      }))
      casinoGames.rows = casinoGamesArrayList
      return { casinoGames, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
