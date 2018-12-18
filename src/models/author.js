'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    userId: DataTypes.INTEGER
  }, {
    tableName: 'authors'
  });
  Author.associate = function(models) {
    // associations can be defined here
  };
  return Author;
};