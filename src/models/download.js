'use strict';
const downloadSchema = require('../../db/schemas/download').getSchema;
const tableName = require('../../db/schemas/download').tableName;

module.exports = (sequelize, DataTypes) => {
  const Download = sequelize.define('Download', downloadSchema(DataTypes), {
    tableName: tableName
  });
  Download.associate = (models) => {
    Download.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Download.belongsTo(models.Book, {
      foreignKey: 'bookId'
    });
  };
  return Download;
};
