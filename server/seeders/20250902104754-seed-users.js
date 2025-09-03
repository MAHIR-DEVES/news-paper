'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const dataPath = path.join(__dirname, '../users.json');
    const userData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await queryInterface.bulkInsert(
      'Users',
      userData.map(item => ({
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role || 'user',
        image: item.image || null,
        created_at: item.created_at ? new Date(item.created_at) : new Date(),
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
