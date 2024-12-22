import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  required: ['title', 'category', 'cmsPageId', 'cmsType']
}

const constraints = ajv.compile(schema)

export class UpdateCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { cmsPageId, title, slug, content, isActive, category, targetUrl, cmsType } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCmsExist = await getOne({ model: db.CmsPage, data: { cmsPageId }, transaction })
      if (!checkCmsExist) return this.addError('CmsNotFoundErrorType')

      if (checkCmsExist.category !== 3) {
        const checkCmsSlugExist = await getOne({ model: db.CmsPage, data: { slug }, transaction })
        if (checkCmsSlugExist && checkCmsSlugExist.cmsPageId !== cmsPageId) return this.addError('CmsExistsErrorType')
      }

      const updateCmsPage = await updateEntity({
        model: db.CmsPage,
        data: {
          slug,
          isActive,
          category,
          title,
          content,
          targetUrl,
          cmsType
        },
        values: { cmsPageId },
        transaction
      })

      return { updateCmsPage, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
