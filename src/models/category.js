'use strict';
const schema = require('../../db/schemas/category');
const tableName = schema.tableName;
const bookCategorySchema = require('../../db/schemas/bookCategory');

module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const Category = sequelize.define('Category', attributes, {
    tableName: tableName
  });
  Category.associate = (models) => {
    Category.hasMany(models.BookCategory, {
      foreignKey: 'categoryId'
    });
  };
  return Category;
};
