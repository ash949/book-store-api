
module.exports = (sequelize, DataTypes) => {
  const Download = sequelize.define('Download', {}, {
    tableName: 'downloads'
  });
  Download.associate = (models) => {
    Download.belongsTo(models.User);
    Download.belongsTo(models.Book);
  };
  return Download;
};
