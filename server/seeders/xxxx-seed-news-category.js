'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const dataPath = path.join(__dirname, '../news_category.json'); // JSON ফাইলের পাথ
    const categories = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await queryInterface.bulkInsert(
      'news_category',
      categories.map(item => ({
        category: item.category,
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('news_category', null, {});
  },
};
