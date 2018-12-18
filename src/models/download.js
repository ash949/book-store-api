
module.exports = (sequelize, DataTypes) => {
  const Download = sequelize.define('Download', {}, {
    tableName: 'downloads'
  });
  Download.associate = (models) => {
    Download.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Download.belongsTo(models.Book, {
      foreignKey: 'bookId'
    });
  };
  return Download;
};
