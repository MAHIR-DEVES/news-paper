'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'pixels',
      [
        {
          code: 'PIXEL-123-ABC',
          created_at: new Date(),
        },
        {
          code: 'PIXEL-456-XYZ',
          created_at: new Date(),
        },
        {
          code: 'PIXEL-789-DEF',
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pixels', null, {});
  },
};
