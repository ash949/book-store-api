'use strict';
const bookSchema = require('../schemas/book').getSchema;
const tableName = require('../schemas/book').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, bookSchema(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['name'], {
        indexName: 'book_name_must_be_unique',
        indeciesType: 'UNIQUE'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};