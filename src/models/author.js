"use strict";
const schema = require("../../db/schemas/author");
const tableName = schema.tableName;

module.exports = (sequelize, DataTypes) => {
  let attributes = schema.getAttributes(DataTypes);
  const Author = sequelize.define("Author", attributes, {
    tableName: tableName
  });
  Author.associate = function(models) {
    Author.belongsTo(models.User, {
      foreignKey: "id"
    });
    Author.hasMany(models.Book, {
      foreignKey: "authorId"
    });
  };
  return Author;
};
