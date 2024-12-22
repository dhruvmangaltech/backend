'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [
      {
        name: 'Bronze',
        bonus_sc: 0,
        bonus_gc: 0,
        sc_required_play: 5,
        sc_required_months: 1,
        gc_required_purchase: 0,
        gc_required_months: 1,
        boost: 0,
        rakeback: 0,
        level: 0,
        is_active: true,
        live_support: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Silver',
        bonus_sc: 2,
        bonus_gc: 1500,
        sc_required_play: 100,
        sc_required_months: 1,
        gc_required_months: 1,
        gc_required_purchase: 2500000,
        boost: 5,
        rakeback: 1,
        level: 1,
        is_active: true,
        live_support: true,
        gradual_loss: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gold',
        bonus_sc: 20,
        bonus_gc: 50000,
        sc_required_play: 250,
        gc_required_purchase: 5000000,
        sc_required_months: 1,
        gc_required_months: 1,
        boost: 10,
        rakeback: 3,
        level: 2,
        is_active: true,
        live_support: true,
        gradual_loss: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Platinum',
        bonus_sc: 50,
        bonus_gc: 250000,
        sc_required_play: 500,
        gc_required_purchase: 250000000,
        sc_required_months: 1,
        gc_required_months: 1,
        boost: 15,
        rakeback: 5,
        level: 3,
        is_active: true,
        live_support: true,
        gradual_loss: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Diamond',
        bonus_sc: 100,
        bonus_gc: 750000,
        sc_required_play: 750,
        gc_required_purchase: 500000000,
        sc_required_months: 1,
        gc_required_months: 1,
        boost: 25,
        rakeback: 7,
        level: 4,
        is_active: true,
        live_support: true,
        gradual_loss: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Emerald',
        bonus_sc: 500,
        bonus_gc: 1000000,
        sc_required_play: 3000,
        gc_required_purchase: 2500000000,
        sc_required_months: 3,
        gc_required_months: 12,
        boost: 35,
        rakeback: 10,
        level: 5,
        is_active: true,
        live_support: true,
        gradual_loss: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ruby',
        bonus_sc: 1500,
        bonus_gc: 2500000,
        sc_required_play: 7500,
        gc_required_purchase: 5000000000,
        sc_required_months: 3,
        gc_required_months: 12,
        boost: 35,
        rakeback: 15,
        level: 6,
        is_active: true,
        live_support: true,
        gradual_loss: 12,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    try {
      await queryInterface.bulkInsert('vip_tier', data)
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('vip_tier', null, {})
    } catch (error) {
      console.log(error)
    }
  }
}
