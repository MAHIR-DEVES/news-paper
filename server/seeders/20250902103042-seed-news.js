'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const dataPath = path.join(__dirname, '../news.json'); // তোমার JSON ফাইলের পাথ
    const newsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await queryInterface.bulkInsert(
      'News',
      newsData.map(item => ({
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        publish: item.publish ? new Date(item.publish) : new Date(),
        headline: item.headline === '1' || item.headline === 1, // string '0'/'1' কে boolean এ কনভার্ট
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('News', null, {});
  },
};
