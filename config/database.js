
module.exports = {
  development: {
    username: 'test',
    password: 'cf123',
    database: 'book_store_db_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false
  },
  test: {
    username: 'test',
    password: 'cf123',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    operatorsAliases: false
  }
};
