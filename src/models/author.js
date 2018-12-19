'use strict';
const authorSchema = require('../../db/schemas/author').getSchema;
const tableName = require('../../db/schemas/author').tableName;

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', authorSchema(DataTypes), {
    tableName: tableName
  });
  Author.associate = function(models) {
    Author.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Author.hasMany(models.Book, {
      foreignKey: 'authorId'
    });
  };
  return Author;
};