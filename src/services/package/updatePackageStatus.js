import ajv from '../../libs/ajv'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity } from '../../utils/crud'
const schema = {
  type: 'object',
  properties: {
    packageId: { type: 'integer' },
    isActive: { enum: [true, false] }
  },
  required: ['packageId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdatePackageStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      packageId,
      isActive
    } = this.args
    const {
      package: PackageModel
    } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    if (packageId <= 0) {
      return this.addError('InvalidIdErrorType')
    }
    try {
      const checkPackageExists = await getOne({
        model: db.package,
        data: { packageId: packageId }
      })

      if (!checkPackageExists) return this.addError('PackageNotFoundErrorType')
      await updateEntity({
        model: PackageModel,
        values: { packageId: packageId },
        data: { isActive: isActive },
        transaction
      })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
