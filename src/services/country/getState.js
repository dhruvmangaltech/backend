import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import db from '../../db/models'
import { getAll, getOne } from '../../utils/crud'
import { Op } from 'sequelize'
export class GetStateService extends ServiceBase {
  async run () {
    const {
      countryCode = 'US', search = ''
    } = this.args
    let data = {}
    if (countryCode !== '') {
      const getCountryId = await getOne({
        model: db.Country,
        data: { code: countryCode }
      })
      data = { countryId: getCountryId.countryId }
    }
    if (search !== '') {
      data = { ...data, name: { [Op.iLike]: `%${search}%` } }
    }
    const state = await getAll({
      attributes: ['name', 'stateCode', 'state_id'],
      model: db.State,
      data: data
    })
    return { success: true, data: state, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
