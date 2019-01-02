'use strict';
let bcrypt = require('bcrypt');
const schema = require('../../db/schemas/user');
const tableName = schema.tableName;
const Author = require('./index').Author;

module.exports = (sequelize, DataTypes) => {
  const attributes = schema.getAttributes(DataTypes);
  const User = sequelize.define('User', attributes, {
    tableName: tableName,
    hooks: {
      beforeCreate: (user, options) => {
        return user.hashPassword();
      },
      beforeUpdate: (user, options) => {
        if(user.changed('password')){
          return user.hashPassword();
        }
      }
    }
  });

  User.setScopes = (models) => {
    User.addScope('defaultScope', {
      include: [
        {
          model: models.Author
        },
        {
          model: models.Admin
        }
      ]
    }, { override: true });
  };
  
  User.addInstanceMethods = (models) => {
    User.prototype.isAuthor = function(){
      let user = this;
      return new Promise((resolve, reject) => {
        models.Author.findOne({where: {id: user.id}}).then(author => {
          if(author){
            resolve(true);
          }else{
            resolve(false);
          }
        }).catch(err => {
          reject(err.message);
        })
      });
    };

    User.prototype.isAdmin = function(){
      let user = this;
      return new Promise((resolve, reject) => {
        models.Admin.findOne({where: {id: user.id}}).then(admin => {
          if(admin){
            resolve(true);
          }else{
            resolve(false);
          }
        }).catch(err => {
          reject(err.message);
        })
      });
    };

    User.prototype.hashPassword = function(){
      let user = this;
      return new Promise((resolve, reject)=>{
        bcrypt.hash(user.password, 2).then((hash)=>{
          user.password = hash;
          resolve(user);
        }).catch((err)=>{
          reject(new Error("couldn't generate a hash for the password"));
        });
      });
    };
  };

  User.associate = (models) => {
    User.hasMany(models.Rating, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Download, {
      foreignKey: 'userId'
    });
    User.hasOne(models.Admin, {
      foreignKey: 'id'
    });
    User.hasOne(models.Author, {
      foreignKey: 'id'
    });
  };
  return User;
};
