'use strict'

const { updateSuperAdminPermissions } = require('../../utils/common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await updateSuperAdminPermissions()
  },

  down: async (queryInterface, Sequelize) => {}
}
