import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import { uploadFile, validateIconFile } from '../../utils/common'
import { OK, defaultLanguage, LOGICAL_ENTITY } from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    isActive: {
      type: 'string',
      enum: ['true', 'false']
    },
    name: {
      type: 'string'
    },
    masterGameCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: ['isActive', 'name', 'masterGameCategoryId', 'isFeatured']
}
const constraints = ajv.compile(schema)
export class CreateSubCategory extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const {
        dbModels: {
          MasterGameCategory: MasterGameCategoryModel,
          MasterGameSubCategory: MasterGameSubCategoryModel
        },
        req: { file: image },
        sequelizeTransaction: transaction
      } = this.context
      const { isActive, name, masterGameCategoryId, isFeatured } = this.args

      if (image) {
        const fileCheckResponse = validateIconFile(null, image)
        if (fileCheckResponse !== OK) return (this.addError('FileTypeNotSupportedErrorType'))
        // if (fileCheckResponse !== OK) this.addError(`${fileCheckResponse}`)
      }

      const isCategoryExist = await getOne({
        model: MasterGameCategoryModel,
        data: { masterGameCategoryId },
        attributes: ['isActive']
      })
      if (!isCategoryExist) return (this.addError('GameCategoryNotExistsErrorType'))

      const nameJSON = JSON.parse(name)
      const isSubCategoryExist = await getOne({
        model: MasterGameSubCategoryModel,
        data: {
          masterGameCategoryId,
          isActive,
          name: {
            [Op.contains]: {
              EN: nameJSON[defaultLanguage]
            }
          }
        },
        raw: true
      })

      if (isSubCategoryExist) return (this.addError('GameSubCategoryExistsErrorType'))

      let lastOrderId = await MasterGameSubCategoryModel.max('orderId')
      if (!lastOrderId) lastOrderId = 0

      if (JSON.parse(isFeatured)) {
        // const featuredCategoryCount = await MasterGameSubCategoryModel.count({ where: { isFeatured: true }, transaction })
        // if (featuredCategoryCount === 3) return this.addError('FeaturedSubCategoryExists')
      }

      const createdSubCategory = await createNewEntity({
        model: MasterGameSubCategoryModel,
        data: {
          name: nameJSON,
          isActive,
          thumbnailType: 'short',
          masterGameCategoryId,
          orderId: lastOrderId + 1,
          isFeatured: JSON.parse(isFeatured)
        },
        transaction
      })

      if (image && typeof (image) === 'object') {
        // const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SUB_CATEGORY}/${createdSubCategory.masterGameSubCategoryId}-${Date.now()}.${image.mimetype.split('/')[1]}`
        const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SUB_CATEGORY}/${createdSubCategory.masterGameSubCategoryId}-${Date.now()}.svg`
        await uploadFile(image, fileName)

        await updateEntity({
          model: MasterGameSubCategoryModel,
          values: { masterGameSubCategoryId: createdSubCategory.masterGameSubCategoryId },
          data: { imageUrl: fileName },
          transaction
        })
        createdSubCategory.imageUrl = fileName
      }

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
