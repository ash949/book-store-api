'use strict';
const ratingSchema = require('../../db/schemas/rating').getSchema;
const tableName = require('../../db/schemas/rating').tableName;

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', ratingSchema(DataTypes), {
    tableName: tableName
  });
  Rating.associate = function (models) {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Rating.belongsTo(models.Book, {
      foreignKey: 'bookId'
    });
  };
  return Rating;
};