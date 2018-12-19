'use strict';
const downloadSchema = require('../schemas/download').getSchema;
const tableName = require('../schemas/download').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, downloadSchema(Sequelize));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};