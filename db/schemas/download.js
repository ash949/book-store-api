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
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: booksSchema.tableName,
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
  tableName: "downloads"
};
