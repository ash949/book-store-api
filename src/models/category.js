'use strict';
const schema = require('../../db/schemas/category');
const tableName = schema.tableName;
const bookCategorySchema = require('../../db/schemas/bookCategory');

module.exports = (sequelize, DataTypes) => {
  let attributes = schema.getAttributes(DataTypes);
  // attributes.name.validate = {
  //   notEmpty: {
  //     args: true,
  //     msg: "Category name can not be empty"
  //   },
  //   isNull: {
  //     args: false,
  //     msg: "Category name can not be null"
  //   },
  //   len: {
  //     args: [1, 30],
  //     msg: "Category's name's maximum length is 30"
  //   },
  // };

  const Category = sequelize.define('Category', attributes, {
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
