'use strict';
const ratingSchema = require('../schemas/rating').getSchema;
const tableName = require('../schemas/rating').tableName;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, ratingSchema(Sequelize)).then(() => {
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
