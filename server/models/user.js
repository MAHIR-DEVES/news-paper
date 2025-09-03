'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // যদি অন্য টেবিলের সাথে relation থাকে, এখানে define করবে
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      image: DataTypes.STRING, // নতুন কলাম
      created_at: DataTypes.DATE, // আপনার JSON ফাইল অনুযায়ী
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users', // টেবিলের নাম
      timestamps: false, // কারণ createdAt / updatedAt JSON এ আছে আলাদা
    }
  );

  return User;
};
