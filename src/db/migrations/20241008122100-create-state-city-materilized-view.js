'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP MATERIALIZED VIEW IF EXISTS state_city_view CASCADE;
    `);

    await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW state_city_view AS
      SELECT 
        city.city_id, 
        city.name AS city_name, 
        city.state_id, 
        state.name AS state_name, 
        state.state_code, 
        state.country_id, 
        city.created_at, 
        city.updated_at
      FROM city
      JOIN state ON city.state_id = state.state_id
      ORDER BY state.state_id, city.name;
    `);

    await queryInterface.sequelize.query(`
      REFRESH MATERIALIZED VIEW state_city_view;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP MATERIALIZED VIEW IF EXISTS state_city_view;
    `);
  }
};
