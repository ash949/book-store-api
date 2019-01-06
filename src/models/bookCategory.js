"use strict";
const schema = require("../../db/schemas/bookCategory");
const tableName = schema.tableName;
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const BookCategory = sequelize.define("BookCategory", attributes, {
    tableName: tableName
  });
  BookCategory.associate = models => {
    BookCategory.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
    BookCategory.belongsTo(models.Book, {
      foreignKey: "bookId"
    });
  };
  return BookCategory;
};
