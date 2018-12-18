
module.exports = (sequelize, DataTypes) => {
  const Download = sequelize.define('Download', {}, {
    tableName: 'downloads'
  });
  Download.associate = (models) => {};
  return Download;
};
