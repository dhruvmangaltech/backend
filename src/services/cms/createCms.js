import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    title: { type: 'object' },
    slug: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_#]*$'
    },
    content: { type: 'object' },
    category: { type: 'number' },
    cmsType: { type: 'number' },
    targetUrl: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['title', 'category', 'isActive', 'cmsType']
}

const constraints = ajv.compile(schema)

export class CreateCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { title, slug, content, isActive, category, cmsType, targetUrl } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      if (+category && +category === 4) {
        query = { category }
      } else {
        if (slug && slug !== '') {
          query = { slug }
        }
      }
      if (query) {
        const checkCmsExist = await getOne({ model: db.CmsPage, data: { ...query }, transaction })
        if (checkCmsExist) {
          return ((+category && +category === 4) ? this.addError('FooterExistErrorType') : this.addError('CmsExistsErrorType'))
        }
      }

      if (+cmsType && +cmsType === 2 && !targetUrl) {
        return this.addError('TargetUrlRequiredErrorType')
      }
      await createNewEntity({
        model: db.CmsPage,
        data: {
          title: title,
          slug: slug || '',
          content: content || '',
          isActive,
          cmsType: cmsType || null,
          targetUrl: targetUrl || null,
          category
        },
        transaction: transaction
      })

      await transaction.commit()

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
