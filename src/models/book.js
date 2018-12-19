'use strict';
const bookSchema = require('../../db/schemas/book').getSchema;
const tableName = require('../../db/schemas/book').tableName;
const ratingSchema = require('../../db/schemas/rating');
const downloadSchema = require('../../db/schemas/download');
const bookCategorySchema = require('../../db/schemas/bookCategory');

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', bookSchema(DataTypes), {
    tableName: tableName
  });
  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: 'authorId'
    });
    Book.belongsToMany(models.User, {
      as: 'Raters',
      through: ratingSchema.tableName,
      foreignKey: 'bookId'
    });
    Book.belongsToMany(models.User, {
      as: 'Downloaders',
      through: downloadSchema.tableName,
      foreignKey: 'bookId'
    });
    Book.belongsToMany(models.Category, {
      through: bookCategorySchema.tableName,
      foreignKey: 'bookId'
    });
  };
  return Book;
};
