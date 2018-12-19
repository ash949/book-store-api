'use strict';
const schema = require('../schemas/rating');
const tableName = schema.tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, schema.getAttributes(Sequelize)).then(() => {
      return queryInterface.addIndex(tableName, ['userId', 'bookId'],
        {
          indexName: 'user_can_only_have_one_rating_per_book',
          indicesType: 'UNIQUE'
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};
