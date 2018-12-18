'use strict';

let bcrypt = require('bcrypt');
let sequelize = require('sequelize');

function hashUserPassword(user){
  return new sequelize.Promise((resolve, reject)=>{
    bcrypt.hash(user.password, 2).then((hash)=>{
      user.password = hash;
      resolve(user);
    }).catch((err)=>{
      reject(new Error("couldn't generate a hash for the password"));
    });
  });
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    verification_token: DataTypes.STRING,
    isRemembered: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: (user, options) => {
        return hashUserPassword(user);
      },
      beforeUpdate: (user, options) => {
        if(user.changed('password')){
          return hashUserPassword(user);
        }
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Rating)
  };
  return User;
};
