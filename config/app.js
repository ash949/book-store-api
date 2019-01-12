const path = require("path");
const rootPath = path.resolve(__dirname, "../");
const self = (module.exports = {
  rootPath: rootPath,
  bookUploadPath: rootPath + "/uploads/books",
  development: {
    baseURL: process.env.PORT
      ? `localhost:${process.env.PORT}`
      : "localhost:3000"
  },
  test: {
    baseURL: process.env.PORT
      ? `localhost:${process.env.PORT}`
      : "localhost:3000"
  },
  production: {
    baseURL: ""
  }
});
