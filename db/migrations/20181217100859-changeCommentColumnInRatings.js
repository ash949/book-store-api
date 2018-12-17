'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'comment',
      {
        allowNull: false,
        type: Sequelize.STRING
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'comment',
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    );
  }
};
