'use strict';
const schema = require('../schemas/book');
const tableName = schema.tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, schema.getAttributes(Sequelize)).then(() => {
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