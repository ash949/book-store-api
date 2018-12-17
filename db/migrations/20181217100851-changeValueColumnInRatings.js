'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'value',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ratings',
      'value',
      {
        allowNull: true,
        type: Sequelize.INTEGER
      }
    );
  }
};
