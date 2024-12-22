import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    size: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    postalCode: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    userName: {
      type: 'string'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class SearchPostalCodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        User: UserModel,
        PostalCode: PostalCodeModel
      }
    } = this.context

    const { postalCode, userName } = this.args
    let codeDetails

    try {
      if (postalCode) {
        codeDetails = await PostalCodeModel.findAndCountAll({
          where: { postalCode },
          attributes: ['postalCodeId', 'userId', 'isClaimed', 'status'],
          include: [{ model: UserModel, attributes: ['userId', 'username', 'email'] }]
        })
      }
      if (userName) {
        codeDetails = await UserModel.findAndCountAll({
          where: { username: { [Op.iLike]: `%${userName}%` } },
          attributes: ['userId', 'username', 'email'],
          include: [{
            model: PostalCodeModel,
            as: 'userPostalCode',
            attributes: ['postalCodeId', 'userId', 'isClaimed', 'status']
          }]
        })
      }
      return { count: codeDetails?.count, rows: codeDetails?.rows, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
