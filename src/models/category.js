
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {}, {
    tableName: 'categories'
  });
  Category.associate = (models) => {};
  return Category;
};
