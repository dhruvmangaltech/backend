import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity, deleteEntity, createNewEntity } from '../../utils/crud'
import { convertStringToLowercaseWithDash, uploadFile } from '../../utils/common'
//import { uploadFiles } from '../../utils/uploadFiles'
const schema = {
  type: 'object',
  properties: {
    masterCasinoGameId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    masterGameSubCategoryId: {
      type: 'string'
    },
    fullScreen: {
      type: 'string',
      enum: ['true', 'false', '', 'null']
    },
    isActive: {
      type: 'string',
      enum: ['true', 'false', '', 'null']
    },
    name: { type: 'string' },
    user: { type: 'object' },
    thumbnail: { type: ['object', 'null'] },
    thumbnailLong: { type: ['object', 'null'] },
    thumbnailShort: { type: ['object', 'null'] }
  },
  required: ['masterCasinoGameId', 'isActive', 'name']
}

const constraints = ajv.compile(schema)

export class UpdateCasinoGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { isActive, masterCasinoGameId, masterGameSubCategoryId, fullScreen, name } = this.args
    if (masterGameSubCategoryId) masterGameSubCategoryId = masterGameSubCategoryId.split(',')
    const {
      req: {
        //files
        file
      }
    } = this.context

    const updateData = { isActive, fullScreen, name }
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCategoryGameExists = await getOne({
        model: db.MasterCasinoGame,
        data: { masterCasinoGameId },
        include: [{ model: db.MasterCasinoProvider, attributes: ['name'] }],
        transaction
      })

      if (!checkCategoryGameExists) return this.addError('CategoryGameNotFoundErrorType')
      // if (files && typeof (files) === 'object') {
      //   for (let index = 0; index < files.length; index++) {
      //     if (files[index]?.fieldname === 'thumbnailLong') {
      //       files[index].key = `${config.get('env')}/games/assets/${await convertStringToLowercaseWithDash(checkCategoryGameExists?.MasterCasinoProvider?.name)}/${checkCategoryGameExists.identifier}-long-${Date.now()}.${files[index].mimetype.split('/')[1]}`
      //     } else if (files[index]?.fieldname === 'thumbnailShort') {
      //       files[index].key = `${config.get('env')}/games/assets/${await convertStringToLowercaseWithDash(checkCategoryGameExists?.MasterCasinoProvider?.name)}/${checkCategoryGameExists.identifier}-short-${Date.now()}.${files[index].mimetype.split('/')[1]}`
      //     } else {
      //       files[index].key = `${config.get('env')}/games/assets/${await convertStringToLowercaseWithDash(checkCategoryGameExists?.MasterCasinoProvider?.name)}/${checkCategoryGameExists.identifier}-${Date.now()}.${files[index].mimetype.split('/')[1]}`
      //     }
      //   }
      //   const uploadFilesArray = await uploadFiles(files)
      //   const updateDataThumbnail = []
      //   for (const fileArray of uploadFilesArray) {
      //     if (fileArray.documentName === 'thumbnailLong') {
      //       updateDataThumbnail.push(
      //         {
      //           thumbnailType: 'long',
      //           masterCasinoGameId: +(masterCasinoGameId),
      //           thumbnail: fileArray.documentKey
      //         }
      //       )
      //     } else if (fileArray.documentName === 'thumbnailShort') {
      //       updateDataThumbnail.push({ thumbnailType: 'short', masterCasinoGameId: +(masterCasinoGameId), thumbnail: fileArray.documentKey })
      //     } else {
      //       updateDataThumbnail.push({ thumbnailType: 'mobile', masterCasinoGameId: +(masterCasinoGameId), thumbnail: fileArray.documentKey })
      //     }
      //   }
      //   if (updateDataThumbnail.length) {
      //     for (const thumbnail of updateDataThumbnail) {
      //       await deleteEntity({
      //         model: db.MasterCasinoGamesThumbnail,
      //         values: { masterCasinoGameId, thumbnailType: thumbnail.thumbnailType },
      //         transaction
      //       })
      //       await createNewEntity({
      //         model: db.MasterCasinoGamesThumbnail,
      //         data: { ...thumbnail },
      //         transaction
      //       })
      //     }
      //   }
      // }
      if (file && typeof (file) === 'object') {
        const imageUrl = `${config.get('env')}/games/assets/${await convertStringToLowercaseWithDash(checkCategoryGameExists?.MasterCasinoProvider?.name)}/${checkCategoryGameExists.identifier}-long-${Date.now()}.${file.mimetype.split('/')[1]}`
        await uploadFile(file, imageUrl)
        updateData.imageUrl = imageUrl
      }
      const updatedCategoryGame = await updateEntity(
        {
          model: db.MasterCasinoGame,
          data: updateData,
          values: { masterCasinoGameId },
          transaction
        })

      if (masterGameSubCategoryId) {
        await deleteEntity({
          model: db.GameSubcategary,
          values: { masterCasinoGameId },
          transaction
        })

        for (const subCategoryId of masterGameSubCategoryId) {
          if (subCategoryId !== '') {
            await createNewEntity({
              model: db.GameSubcategary,
              data: {
                masterCasinoGameId: +(masterCasinoGameId),
                masterGameSubCategoryId: +(subCategoryId)
              },
              transaction
            })
          }
        }
      }

      return { updatedCategoryGame, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
