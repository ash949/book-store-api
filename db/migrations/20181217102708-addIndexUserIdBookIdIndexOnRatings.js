'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex(
      'Ratings',
      ['userId', 'bookId'],
      {
        indexName: 'user_can_only_have_one_rating_per_book',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex(
      'Ratings',
      ['userId', 'bookId']
    );
  }
};
