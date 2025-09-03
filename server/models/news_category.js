'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NewsCategory extends Model {
    static associate(models) {
      // যদি News এর সাথে relation রাখতে চাও, এখানে define করবে
    }
  }

  NewsCategory.init(
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'NewsCategory',
      tableName: 'news_category',
      timestamps: false,
    }
  );

  return NewsCategory;
};
