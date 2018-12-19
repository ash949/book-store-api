'use strict';
const schema = require('../schemas/admin');
const tableName = schema.tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, schema.getAttributes(Sequelize)).then(() => {
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