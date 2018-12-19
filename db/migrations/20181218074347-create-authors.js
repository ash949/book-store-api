'use strict';
const authorSchema = require('../schemas/author').getSchema;
const tableName = require('../schemas/author').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, authorSchema(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['userId'],
        {
          indexName: 'a_user_can_only_have_one_author_account',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};