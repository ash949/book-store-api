'use strict';
const schema = require('../../db/schemas/book');
const tableName = schema.tableName;
const ratingSchema = require('../../db/schemas/rating');
const downloadSchema = require('../../db/schemas/download');
const bookCategorySchema = require('../../db/schemas/bookCategory');
const db = require('./index');




module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const Book = sequelize.define('Book', attributes, {
    tableName: tableName
  });

  

  Book.setScopes = (models) => {
    Book.addScope('defaultScope', {
      include: [
        {
          model: models.BookCategory,
          include: [
            {
              model: models.Category
            }
          ]
        },
        {
          model: models.Author,
        }
      ]
    }, { override: true });
  };
  
  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: 'authorId'
    });
    Book.belongsToMany(models.User, {
      as: 'Raters',
      through: ratingSchema.tableName,
      foreignKey: 'bookId',
      otherKey: 'userId'
    });
    Book.belongsToMany(models.User, {
      as: 'Downloaders',
      through: downloadSchema.tableName,
      foreignKey: 'bookId',
      otherKey: 'userId'
    });
    Book.hasMany(models.BookCategory, {
      foreignKey: 'bookId'
    });

    Book.addInstanceMethods = (models) => {
      Book.prototype.getFullDetails = function(){
        let book = this;
        return Book.findByPk(book.id, {
          include: [
            {
              model: models.BookCategory,
              include: [
                {
                  model: models.Category
                }
              ]
            }
          ]
        });
      }
    }
  };
  return Book;
};
