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
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 1,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 2,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 3,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 4,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 5,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 6,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        parent_type: 'admin',
        parent_id: 1,
        valid_from: new Date(),
        // valid_to: new Date(),
        bonus_type: BONUS_TYPE.DAILY_BONUS,
        day: 7,
        currency: JSON.stringify({}),
        is_active: false,
        promo_code: UUIDV4(),
        bonus_name: 'Daily Bonus',
        description: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bonus', null, {})
  }
}
