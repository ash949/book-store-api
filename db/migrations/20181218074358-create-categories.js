'use strict';
const categorySchema = require('../schemas/category').getSchema;
const tableName = require('../schemas/category').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, categorySchema(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['name'], {
          indexName: 'category_name_must_be_unique',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};