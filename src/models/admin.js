'use strict';
const schema = require('../../db/schemas/admin');
const tableName = schema.tableName;

module.exports = (sequelize, DataTypes) => {
  let attributes = schema.getAttributes(DataTypes);
  const Admin = sequelize.define('Admin', attributes, {
    tableName: tableName
  });
  Admin.associate = function(models) {
    Admin.belongsTo(models.User, {
      foreignKey: 'id'
    });
  };
  return Admin;
};