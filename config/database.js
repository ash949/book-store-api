const fs = require('fs');

module.exports = {
  development: {
    username: 'test',
    password: 'cf123',
    database: 'book_store_db_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  // test: {
  //   username: 'database_test',
  //   password: null,
  //   database: 'database_test',
  //   host: '127.0.0.1',
  //   dialect: 'mysql'
  // },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
    //   }
    // }
  }
};