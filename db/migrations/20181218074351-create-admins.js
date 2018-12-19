'use strict';
const adminSchema = require('../schemas/admin').getSchema;
const tableName = require('../schemas/admin').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, adminSchema(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['userId'],
        {
          indexName: 'a_user_can_only_have_one_admin_account',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};