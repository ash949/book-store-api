
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {}, {
    tableName: 'books'
  });
  Book.associate = (models) => {};
  return Book;
};
