import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import db from '../../db/models'
import { RESPONSIBLE_GAMBLING_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'string' },
    userType: { type: 'string' },
    active: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserResponsibleSetting extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      userId,
      active
    } = this.args

    const {
      ResponsibleGambling: ResponsibleGamblingModel
    } = db

    if (!(+userId)) {
      return this.addError('InvalidIdErrorType')
    }

    try {
      const whereConditions = {
        userId
      }
      if (active) {
        whereConditions.status = active
      }

      const uerResponsibleSetting = await ResponsibleGamblingModel.findAll({
        where: whereConditions,
        order: [['createdAt', 'DESC']]
      })

      const reverseMapping = {}
      for (const key in RESPONSIBLE_GAMBLING_TYPE) {
        const value = RESPONSIBLE_GAMBLING_TYPE[key]
        reverseMapping[value] = key
      }

      const groupedData = {}

      // Iterate through the data array and group objects by responsibleGamblingType
      uerResponsibleSetting.forEach((item) => {
        const type = reverseMapping[item.responsibleGamblingType]

        // If the responsibleGamblingType doesn't exist in groupedData, create an empty array for it
        if (!groupedData[type]) {
          groupedData[type] = []
        }

        // Push the item into the appropriate group
        groupedData[type].push(item)
      })
      if (!groupedData) { return {} }
      return { groupedData }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
