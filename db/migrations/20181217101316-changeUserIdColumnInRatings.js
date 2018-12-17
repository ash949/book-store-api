'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'userId',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'userId',
      {
        allowNull: true,
        type: Sequelize.INTEGER
      }
    );
  }
};
