import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'
import config from '../../configs/app.config'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    masterGameCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    limit: {
      type: 'string'
    },
    pageNo: {
      type: 'string'
    },
    search: {
      type: 'string'
    },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    sort: {
      type: 'string',
      enum: ['asc', 'desc']
    },
    orderBy: {
      type: 'string'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetSubCategoryList extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameCategory: MasterGameCategoryModel,
        MasterGameSubCategory: MasterGameSubCategoryModel
      }
    } = this.context
    const { masterGameCategoryId, limit, pageNo, search, isActive, orderBy, sort } = this.args
    const order = [[orderBy || 'masterGameSubCategoryId', sort || 'asc']]

    let query = { }
    const { page, size } = pageValidation(pageNo, limit)

    if (isActive && isActive !== 'all') {
      query = { ...query, isActive }
    }

    if (masterGameCategoryId) {
      query = { ...query, masterGameCategoryId }
    }

    if (search) {
      query = { ...query, name: { EN: { [Op.iLike]: `%${search.trim()}%` } } }
    }
    let orderObj = []
    if (orderBy === 'MasterGameCategory') {
      orderObj = [[MasterGameCategoryModel, 'name', sort || 'asc']]
    } else {
      orderObj = order
    }
    const subCategory = await MasterGameSubCategoryModel.findAndCountAll({
      where: query,
      order: orderObj,
      include: [{
        model: MasterGameCategoryModel,
        attributes: ['name']
      }],
      limit: size,
      offset: ((page - 1) * size)
    })
    const subCategoryArray = []
    for (const subCategoryImages of subCategory.rows) {
      if (subCategoryImages.imageUrl) {
        subCategoryImages.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${subCategoryImages.imageUrl}`
      }
      if (subCategoryImages.thumbnailLong) {
        subCategoryImages.thumbnailLong = `${s3Config.S3_DOMAIN_KEY_PREFIX}${subCategoryImages.thumbnailLong}`
      }
      if (subCategoryImages.thumbnailShort) {
        subCategoryImages.thumbnailShort = `${s3Config.S3_DOMAIN_KEY_PREFIX}${subCategoryImages.thumbnailShort}`
      }
      subCategoryArray.push(subCategoryImages)
    }
    subCategory.rows = subCategoryArray
    return { success: true, message: SUCCESS_MSG.GET_SUCCESS, subCategory }
  }
}
