module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    )
    await queryInterface.addColumn('users', 'referral_code', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.fn('uuid_generate_v4')
    })

  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('users', 'referral_code')
  }
}