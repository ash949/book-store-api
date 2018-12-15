'use strict';
module.exports = (sequelize, DataTypes) => {
	const Rating = sequelize.define('Rating', {
		value: DataTypes.INTEGER,
		comment: DataTypes.STRING
	}, {});
	Rating.associate = function (models) {
		// associations can be defined here
	};
	return Rating;
};