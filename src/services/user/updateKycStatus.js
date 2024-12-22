import db from '../../db/models'
import ajv from '../../libs/ajv'
// import ServiceBase from '../serviceBase'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { SUMSUB_APPLICANT_REVIEW_TYPES, SUMSUB_APPLICANT_TYPES, SUMSUB_REVIEW_TYPE } from '../../utils/constants/constant'
import Logger from '../../libs/logger'

const schema = { type: 'object' }
const constraints = ajv.compile(schema)

export class UpdateKycStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { ...payload } = this.args

    try {
      if (SUMSUB_APPLICANT_TYPES.includes(payload.type) || (SUMSUB_APPLICANT_REVIEW_TYPES.includes(payload.type) && payload?.reviewResult?.reviewAnswer === SUMSUB_REVIEW_TYPE)) {
        Logger.info(`${payload.type}, ${payload?.reviewResult?.reviewAnswer}`)
        await updateEntity({ model: db.User, data: { kycStatus: payload.reviewStatus.toUpperCase(), kycApplicantId: payload.applicantId }, values: { userId: payload.externalUserId } })
      }

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
