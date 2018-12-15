'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			username: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING
			},
			verification_token: {
				type: Sequelize.STRING
			},
			isAdmin: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isAuthor: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isRemembered: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isVerified: {
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
		}).then(() => {
			return queryInterface.addIndex('Users', ['username'], {
				indexName: 'username',
				indicesType: 'UNIQUE'
			})
		}).then(() => {
			return queryInterface.addIndex('Users', ['email'], {
				indexName: 'email',
				indicesType: 'UNIQUE'
			})
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Users');
	}
};