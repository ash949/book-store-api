'use strict';
const categorySchema = require('../../db/schemas/category').getSchema;
const tableName = require('../../db/schemas/category').tableName;
const bookCategorySchema = require('../../db/schemas/bookCategory');

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', categorySchema(DataTypes), {
    tableName: tableName
  });
  Category.associate = (models) => {
    Category.belongsToMany(models.Book, {
      through: bookCategorySchema.tableName,
      foriegnKey: 'categoryId'
    });
  };
  return Category;
};
