const express = require("express")
const path = require("path")
const helmet = require("helmet")
const cookieSession = require("cookie-session")
const bodyParser = require("body-parser")

const app = express()

// séparer les données de connexion sensibles
require("dotenv").config()
cookieName = process.env.NAME_COOKIE
secretCookie = process.env.SECRET_COOKIE

// synchroniser Sequelize avec la base de données 
const db = require("./models/index")
db.sequelize.sync()

// securisé cookie http-only
app.use(
	cookieSession({
		name: cookieName,
		secret: secretCookie,
		maxAge: 86400000, //24h
		secure: true,
		httpOnly: true,
		domain: "http://localhost:3000",
	})
)

app.use(helmet()) // application sécurisée par divers en-têtes HTTP (comme désactiver le cache, protéger contre l'injection, etc.)
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
        helmet.crossOriginOpenerPolicy({ policy: "same-origin" }),
        helmet.crossOriginEmbedderPolicy({ policy: "require-corp" }));
		
// autoriser différents contrôles d'accès
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
	next()
})

// Analyseurs de données POST
app.use(bodyParser.json());

// fichier route
app.use("/images", express.static(path.join(__dirname, "images")))

// user routes
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes); 

// article routes
const postRoutes = require('./routes/post');
app.use('/api/posts', postRoutes); 

// comment routes
const commentRoutes = require('./routes/comment');
app.use('/api/comments', commentRoutes); 

module.exports = app
