'use strict';
const bookCategorySchema = require('../schemas/bookCategory').getSchema;
const tableName = require('../schemas/bookCategory').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, bookCategorySchema(Sequelize)).then(() => {
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