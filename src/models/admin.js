'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    userId: DataTypes.INTEGER
  }, {
    tableName: 'admins'
  });
  Admin.associate = function(models) {
    Admin.belongsTo(models.User);
  };
  return Admin;
};