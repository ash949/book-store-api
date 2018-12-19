'use strict';
const schema = require('../../db/schemas/book');
const tableName = schema.tableName;
const ratingSchema = require('../../db/schemas/rating');
const downloadSchema = require('../../db/schemas/download');
const bookCategorySchema = require('../../db/schemas/bookCategory');

module.exports = (sequelize, DataTypes) => {
  
  let attributes = schema.getAttributes(DataTypes);
  attributes.name.validate = {
    notEmpty: {
      args: true,
      msg: "Book's name can not be empty"
    },
    len: {
      max: {
        args: 250,
        msg: "book's name's maximum length is 250"
      }
    },
  };

  attributes.description.validate = {
    notEmpty: {
      args: true,
      msg: "Book's description can not be empty"
    },
    len: {
      max: {
        args: 5000,
        msg: "book's description's maximum length is 5000"
      }
    }
  };

  const Book = sequelize.define('Book', attributes, {
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
