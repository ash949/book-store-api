'use strict';
const schema = require('../../db/schemas/rating');
const tableName = schema.tableName;

module.exports = (sequelize, DataTypes) => {
  let attributes = schema.getAttributes(DataTypes);
  attributes.value.validate = {
    min: {
      args: 0,
      msg: "Ratings can't be lower than 0"
    },
    max: {
      args: 10,
      msg: "Ratings can't be higher than 10"
    }
  };

  attributes.comment.validate = {
    notEmpty: {
      args: true,
      msg: "Comments can't be empty"
    },
    len: {
      max: 200,
      msg: "Comment's maximum length is 200 charcters"
    }
  }
  const Rating = sequelize.define('Rating', attributes, {
    tableName: tableName
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