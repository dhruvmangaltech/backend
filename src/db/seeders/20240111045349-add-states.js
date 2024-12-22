'use strict'
import db from '../models'
import { getOne } from '../../utils/crud'
import cityJson from '../../scripts/city.json'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getCountryId = await getOne({
      model: db.Country,
      data: { code: 'US' }
    })

    const data = [
      // ... (previous code)
    ]

    await db.State.bulkCreate(data, {
      updateOnDuplicate: ['name']
    })

    const cityDataToPush = []
    for (const cityData of cityJson) {
      const getStateId = await getOne({
        model: db.State,
        data: { state_code: cityData.stateCode }
      })

      if (getStateId?.stateId) {
        cityDataToPush.push({
          stateId: getStateId?.stateId,
          name: cityData.name,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    if (cityDataToPush.length) {
      await db.City.bulkCreate(cityDataToPush, {
        updateOnDuplicate: ['name']
      })
    }

    const commentedStates = [
      {
        name: 'Idaho',
        stateCode: 'ID',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kentucky',
        stateCode: 'KY',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nevada',
        stateCode: 'NV',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Washington',
        stateCode: 'WA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    for (const state of commentedStates) {
      const existingState = await getOne({
        model: db.State,
        data: { stateCode: state.stateCode }
      })

      if (!existingState) {
        await db.State.create(state)
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('state', null, {})
    } catch (error) {
      console.log(error)
    }
  }
}
