module.exports = {
  getAttributes: (Sequelize) => {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'this username is already registered'
        },
        validate: {
          len: {
            args: [6, 20],
            msg: "username's length must be in [6, 20]"
          },
          notEmpty: {
            args: true,
            msg: "username can't be empty"
          }
        }
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'this Email is already registered'
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'entered Email is not valid'
          }
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          len: {
            args: 6,
            msg: `password's length must be at least 6`
          }
        }
      },
      verification_token: {
        type: Sequelize.STRING
      },
      isRemembered: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  tableName: 'users'
};