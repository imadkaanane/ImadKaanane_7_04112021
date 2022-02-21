"use strict"
const {Model} = require("sequelize")

module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {
			// definir les tables associées
			models.Comment.belongsTo(models.User, {
				foreignKey: {
					allowNull: false,
				},
				onDelete: "CASCADE", 
			})
            models.Comment.belongsTo(models.Post, {
				foreignKey: {
					allowNull: false,
				},
				onDelete: "CASCADE",
			})
		}
	}
	Comment.init(
		{
			text: {type: DataTypes.TEXT, allowNull: true},
		},
		{
			sequelize,
			modelName: "Comment", 
		}
	)
	return Comment
}
