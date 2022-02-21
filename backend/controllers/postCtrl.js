const jwt = require("jsonwebtoken")
const fs = require("fs")

const db = require("../models")
const Post = db.Post
const User = db.User


// séparer les données de connexion sensibles
require("dotenv").config()
secretTokenKey = process.env.TOKEN_SECRET

// Obtenir l'id de l'utilisateur par jeton (token)
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

// Créer un nouvel article
exports.createPost = (req, res) => {
	
	if (!req.body) return res.status(403).send("Erreur, la requête doit contenir des informations") // besoin de contenu
	
	const decodedId = getTokenUserId(req) // obtenir l'id

	// si la photo
	let pictureUrl = ""
	if (req.file) {
		pictureUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
	}

	// Créer l'article
	const post = {
		text: req.body.text,
		author: decodedId,
		youtube: req.body.youtube,
		picture: pictureUrl,
		UserId: decodedId,
	}

	// Sauvegarder l'article sur la db
	Post.create(post)
		.then((data) => {
			res.send(data)
		})
		.catch((error) => res.status(500).send({error}))
}

// Obtenir tous les articles
exports.getAllPosts = (req, res) => {
	// trouver et envoyer l'article, informations sur l'auteur
	Post.findAll({
		order: [["createdAt", "DESC"]],
		include: [{model: User, attributes: ["firstName", "lastName", "photo"]}],
	})
		.then((posts) => {
			res.status(200).send(posts)
		})
		.catch((error) => res.status(500).send({error}))
}


// supprimer un seul article
exports.deletePost = (req, res) => {
	const decodedId = getTokenUserId(req) // obtenir ID

	Post.findOne({where: {id: req.params.id}})
		.then((post) => {
			//vérifier si l'utilisateur est l'auteur de l'article ou est administrateur
			if (post.UserId === decodedId || checkAdmin(decodedId)) {
				const filename = post.picture.split("/images/")[1]  // suppression de la photo puis suppression de l'rticle
				fs.unlink(`./images/${filename}`, () => {
					Post.destroy({where: {id: req.params.id}})
						.then(() => res.status(200).send("Article supprimé"))
						.catch((error) => res.status(403).send({error}))
				})
			} else {
				res.status(403).send("Erreur d'authenfication")
			}
		})
		.catch((error) => res.status(500).send({error}))

}

