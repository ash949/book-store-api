'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    userId: DataTypes.INTEGER
  }, {
    tableName: 'authors'
  });
  Author.associate = function(models) {
    Author.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Author.hasMany(models.Book, {
      foreignKey: 'authorId'
    });
  };
  return Author;
};