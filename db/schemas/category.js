module.exports = {
  getAttributes: Sequelize => {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        unique: {
          args: true,
          msg: "category name is already registered"
        },
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Category name can not be empty"
          },
          len: {
            args: [1, 30],
            msg: "Category's name's maximum length is 30"
          }
        }
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
  tableName: "categories"
};
