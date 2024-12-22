import { Op } from 'sequelize'

import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, deleteEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    pageId: { 
      type: 'string',
      pattern: '^[0-9]+$' 
    },
  },
  required: ['pageId']
}

const constraints = ajv.compile(schema)

export class DeletePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkPageExists = await getOne({
        model: db.PageContent,
        data: { pageId: pageId }
      })

      if (!checkPageExists) return this.addError('PageNotFoundErrorType')

      await deleteEntity({
        model: db.PageContent,
        values: { pageId },
        transaction
      })

      return { message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}