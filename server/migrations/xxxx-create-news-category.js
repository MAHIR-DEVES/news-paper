'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('news_category', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('news_category');
  },
};
