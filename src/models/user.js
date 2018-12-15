'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    verification_token: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isAuthor: DataTypes.BOOLEAN,
    isRemembered: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Rating)
  };
  return User;
};