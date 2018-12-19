'use strict';
const schema = require('../schemas/bookCategory');
const tableName = schema.tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, schema.getAttributes(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['bookId', 'categoryId'], {
          indexName: 'book_can_have_one_record_per_category',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};