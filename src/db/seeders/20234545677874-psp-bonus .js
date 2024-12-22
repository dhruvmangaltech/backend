'use strict'

import { BONUS_TYPE } from '../../utils/constants/constant'
import { v4 as UUIDV4 } from 'uuid'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bonus', [
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        bonus_type: BONUS_TYPE.PSP_BONUS,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'PSP Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date(),
        percentage: 0
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bonus', null, {})
  }
}
