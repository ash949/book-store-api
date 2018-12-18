'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    value: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    tableName: 'ratings'
  });
  Rating.associate = function (models) {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Rating.belongsTo(models.Book, {
      foreignKey: 'bookId'
    });
  };
  return Rating;
};