
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {}, {
    tableName: 'categories'
  });
  Category.associate = (models) => {
    Category.belongsToMany(models.Book, {
      through: 'book_categories',
      foriegnKey: 'categoryId'
    });
  };
  return Category;
};
