'use strict';
const adminSchema = require('../../db/schemas/admin').getSchema;
const tableName = require('../../db/schemas/admin').tableName;

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', adminSchema(DataTypes), {
    tableName: tableName
  });
  Admin.associate = function(models) {
    Admin.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Admin;
};