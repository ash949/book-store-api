
const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const self = module.exports = {
  rootPath: rootPath,
  bookUploadPath: rootPath + '/uploads/books',
  development: {
    baseURL: 'localhost:3000'
  }
};