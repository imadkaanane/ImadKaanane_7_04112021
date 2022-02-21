const passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator()
passwordSchema
	.is()
	.min(6) // Minimum 6 lettres
	.is()
	.max(50) // Maximum 50 lettres
	.has()
	.uppercase(1) // Doit contenir des lettres majuscules
	.has()
	.lowercase(1) // Doit contenir des lettres minuscules
	.has()
	.digits(1) // Doit contenir au moins 1 chiffre
	.has()
	.not()
	.spaces() // Ne devrait pas avoir d'espaces
	.has()
	.symbols(1) // Minimum 1 symbole
	.is()
	.not()
	.oneOf(["Passw0rd", "Password123"]) // Blacklister ces valeurs

exports.verifyPassword = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		return res
			.status(400)
			.json(
				`mot de passe trop faible. Le mot de passe doit contenir minimum 6 characteres, maximum 50, minimum 1 lettre majuscule et 1 lettre miniscule, minimum 1 chiffre, pas d'espace. \r Eror : ${passwordSchema.validate(
					req.body.password,
					{list: true}
				)}`
			)
	} else {
		next()
	}
}

exports.verifySamePasswords = (req, res, next) => {
	if (req.body.password !== req.body.passwordConfirm) return res.status(400).json("Les mots de passe ne sont pas identiques.")
	else next()
}
