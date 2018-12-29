'use strict';
let bcrypt = require('bcrypt');
let sequelize = require('sequelize');
const schema = require('../../db/schemas/user');
const tableName = schema.tableName;


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
  const attributes = schema.getAttributes(DataTypes);
  const User = sequelize.define('User', attributes, {
    tableName: tableName,
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
    User.hasMany(models.Rating, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Download, {
      foreignKey: 'userId'
    });
    User.hasOne(models.Admin, {
      foreignKey: 'userId'
    });
    User.hasOne(models.Author, {
      foreignKey: 'userId'
    });
  };
  return User;
};
  
  
  