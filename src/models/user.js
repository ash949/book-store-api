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
  let attributes = schema.getAttributes(DataTypes);
  attributes.username.validate = {
    len: {
      args: [6, 20],
      msg: "username's length must be in [6, 20]"
    },
    notEmpty: {
      args: true,
      msg: "username can't be empty"
    }
  };

  attributes.email.validate = {
    isEmail: {
      args: true,
      msg: 'entered Email is not valid'
    }
  };

  attributes.password.validate = {
    len: {
      args: 6,
      msg: `password's length must be at least 6`
    }
  };
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
  
  
  