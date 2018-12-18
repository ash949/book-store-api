
module.exports = (sequelize, DataTypes) => {
  const BookCategory = sequelize.define('BookCategory', {}, {
    tableName: 'book_categories'
  });
  BookCategory.associate = (models) => {};
  return BookCategory;
};
