import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { uploadFile, validateFile } from '../../utils/common'
import { updateEntity, getOne } from '../../utils/crud'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'
import config from '../../configs/app.config'

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
    masterGameSubCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    }
  },
  required: ['isActive', 'name', 'masterGameCategoryId', 'masterGameSubCategoryId', 'isFeatured']
}

const constraints = ajv.compile(schema)

export class UpdateSubCategory extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameCategory: MasterGameCategoryModel,
        MasterGameSubCategory: MasterGameSubCategoryModel
      },
      req: { file: image },
      sequelizeTransaction: transaction
    } = this.context
    const { isActive, name, masterGameCategoryId, masterGameSubCategoryId, isFeatured } = this.args
    let updateObj = { name: JSON.parse(name), isActive, masterGameCategoryId, isFeatured: JSON.parse(isFeatured) }

    if (image) {
      const fileCheckResponse = validateFile(null, image)
      if (fileCheckResponse !== OK) {
        this.addError(`${fileCheckResponse}`)
      }
    }
    const isCategoryExist = await getOne({
      model: MasterGameCategoryModel,
      data: { masterGameCategoryId },
      attributes: ['isActive']
    })
    if (!isCategoryExist) {
      return (this.addError('GameCategoryNotExistsErrorType'))
    }

    const isSubCategoryExist = await getOne({
      model: MasterGameSubCategoryModel,
      data: { masterGameSubCategoryId },
      attributes: ['isActive', 'isFeatured']
    })
    if (!isSubCategoryExist) {
      return (this.addError('GameSubCategoryNotExistsErrorType'))
    }

    // if (!isSubCategoryExist.isFeatured && JSON.parse(isFeatured)) {
    //   const featuredCategoryCount = await MasterGameSubCategoryModel.count({ where: { isFeatured: true }, transaction })
    //   if (featuredCategoryCount === 3) return this.addError('FeaturedSubCategoryExists')
    // }

    if (image && typeof (image) === 'object') {
      // const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SUB_CATEGORY}/${masterGameSubCategoryId}-${Date.now()}.${image.mimetype.split('/')[1]}`
      const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SUB_CATEGORY}/${masterGameSubCategoryId}-${Date.now()}.svg`
      await uploadFile(image, fileName)
      updateObj = { ...updateObj, imageUrl: fileName }
    }

    await updateEntity({
      model: MasterGameSubCategoryModel,
      data: updateObj,
      values: { masterGameSubCategoryId },
      transaction
    })

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
