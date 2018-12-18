
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {}, {
    tableName: 'books'
  });
  Book.associate = (models) => {
    Book.belongsTo(models.Author);
    Book.belongsToMany(models.User, {
      as: 'Raters',
      through: 'ratings',
      foreignKey: 'bookId'
    });
    Book.belongsToMany(models.User, {
      as: 'Downloaders',
      through: 'downloads',
      foreignKey: 'bookId'
    });
    Book.belongsToMany(models.Category, {
      through: 'book_categories',
      foreignKey: 'bookId'
    });
  };
  return Book;
};
