const booksSchema = require("./book");
const usersSchema = require("./user");

module.exports = {
  getAttributes: Sequelize => {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          min: {
            args: 0,
            msg: "Ratings can't be lower than 0"
          },
          max: {
            args: 10,
            msg: "Ratings can't be higher than 10"
          }
        }
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Comments can't be empty"
          },
          len: {
            max: [1, 200],
            msg: "Comment's maximum length is 200 charcters"
          }
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: usersSchema.tableName,
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: booksSchema.tableName,
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    };
  },
  tableName: "ratings"
};
