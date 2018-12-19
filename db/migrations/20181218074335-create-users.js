'use strict';
const schema = require('../schemas/user');
const tableName = schema.tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, schema.getAttributes(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['username'], {
        indexName: 'username_must_be_unique',
        indicesType: 'UNIQUE'
      });
    }).then(() => {
      return queryInterface.addIndex(tableName, ['email'], {
        indexName: 'email_must_be_unique',
        indicesType: 'UNIQUE'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};
