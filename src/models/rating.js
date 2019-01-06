"use strict";
const schema = require("../../db/schemas/rating");
const tableName = schema.tableName;

module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const Rating = sequelize.define("Rating", attributes, {
    tableName: tableName
  });
  Rating.associate = function(models) {
    Rating.belongsTo(models.User, {
      foreignKey: "userId"
    });
    Rating.belongsTo(models.Book, {
      foreignKey: "bookId"
    });
  };
  return Rating;
};
