'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'comments',
      [
        {
          news_id: 1, // ধরলাম news টেবিলে id=1 আছে
          name: 'John Doe',
          email: 'john@example.com',
          image: '/uploads/users/john.png',
          role: 'user',
          comment: 'This is a great article!',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          news_id: 1,
          name: 'Jane Smith',
          email: 'jane@example.com',
          image: null,
          role: 'admin',
          comment: 'Thanks for sharing this news.',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          news_id: 2, // আরেকটা news post এর কমেন্ট
          name: 'Alex Khan',
          email: 'alex@example.com',
          image: '/uploads/users/alex.jpg',
          role: 'user',
          comment: 'Very informative content!',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  },
};
