const authorsSchema = require('./author');

module.exports = {
  getAttributes: (Sequelize) => {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'this book name is already registered'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Book's name can not be empty"
          },
          len: {
            args: [1, 250],
            msg: "book's name's maximum length is 250"
          },
        }
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Book's description can not be empty"
          },
          len: {
            args: [1, 5000],
            msg: "book's description's maximum length is 5000"
          }
        }
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: authorsSchema.tableName,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }
  },
  tableName: 'books'
};