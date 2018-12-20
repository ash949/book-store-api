const Category = require('../../src/models').Category;

module.exports = (factory) => {
  factory.define('category', Category, {
    id: factory.seq('Category.id', (n) => n),
    name: factory.seq('Category.name', (n) => `category_${n}`)
  });
};