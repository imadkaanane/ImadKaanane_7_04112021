"use strict"
const {Model} = require("sequelize")

module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			// definir les tables associées
			models.Post.belongsTo(models.User, {
				foreignKey: {
					allowNull: false,
				},
				onDelete: "CASCADE",
			})
			models.Post.hasMany(models.Comment)
			
		}
	} 
	Post.init(
		{
			text: {type: DataTypes.TEXT, allowNull: true},
			picture: {type: DataTypes.STRING, allowNull: true},
			youtube: {type: DataTypes.STRING, allowNull: true},
		}, 
		{
			sequelize,
			modelName: "Post",
		}
	)

	return Post
}

