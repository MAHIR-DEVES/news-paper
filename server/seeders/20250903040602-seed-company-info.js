'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'company_info',
      [
        {
          name: 'Tech Solutions Ltd.',
          email: 'info@techsolutions.com',
          phone: '+880123456789',
          address: '123, Dhaka, Bangladesh',
          description:
            'Leading IT company providing web and software solutions.',
          logo: '/uploads/company/logo1.png',
          created_at: new Date(),
        },
        {
          name: 'Global Innovations',
          email: 'contact@globalinnovations.com',
          phone: '+880987654321',
          address: '456, Chittagong, Bangladesh',
          description: 'Innovative solutions for modern businesses.',
          logo: '/uploads/company/logo2.png',
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('company_info', null, {});
  },
};
