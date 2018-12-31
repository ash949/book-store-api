'use strict';
const schema = require('../../db/schemas/download');
const tableName = schema.tableName;

module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const Download = sequelize.define('Download', attributes, {
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
