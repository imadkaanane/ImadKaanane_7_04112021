const jwt = require("jsonwebtoken")

const db = require("../models")
const User = db.User
const Comment = db.Comment


// séparer les données de connexion sensibles
require("dotenv").config()
secretTokenKey = process.env.TOKEN_SECRET

// Obtenir l'id de l'utilisateur par jeton
const getTokenUserId = (req) => {
	const token = req.headers.authorization.split(" ")
	const decodedToken = jwt.verify(token[1], secretTokenKey)
	const decodedId = decodedToken.userId
	return decodedId
}

// vérifier si l'utilisateur est admin
let admin = false
const checkAdmin = (decodedId) => {
	User.findOne({where: {id: decodedId}}).then((user) => (admin = user.isAdmin))
	return admin
}

// Créer un nouveau commentaire
exports.createComment = (req, res) => {
	if (!req.body) return res.status(403).send("Erreur, la requête doit contenir des informations") // need content

	const decodedId = getTokenUserId(req) // obtenir ID

	// Création du commentaire
	const comment = {
		text: req.body.text,
		UserId: decodedId,
		PostId: req.params.id
	}

	Comment.create(comment)
		.then(() => {
			res.send("Comment created") 
		})
		.catch((error) => res.status(500).send({error}))
}

// obtenir tt les commentaires
exports.getAllComments = (req, res) => {
	// trouver l'article par identifiant et avec les informations sur l'auteur
	Comment.findAll({
		where: {PostId: req.params.id},
		order: [["createdAt", "DESC"]],
		include: [{model: User, attributes: ["firstName", "lastName", "photo"]}],
	})
		.then((comment) => {
			res.status(200).send(comment)
		})
		.catch((error) => res.status(500).send({error}))

}

// supprimer un seul commentaire
exports.deleteComment = (req, res) => {
	const decodedId = getTokenUserId(req) // obtenir ID

	Comment.findOne({where: {id: req.params.id}})
		.then((comment) => {
			//vérifier si l'utilisateur est l'auteur de l'article ou est administrateur
			if (comment.UserId === decodedId || checkAdmin(decodedId)) {
					Comment.destroy({where: {id: req.params.id}})
						.then(() => res.status(200).send("Commentaire supprimé"))
						.catch((error) => res.status(500).send({error}))
			} else {
				res.status(403).send("Erreur d'authentification")
			}
		})
		.catch((error) => res.status(500).send({error}))
}
