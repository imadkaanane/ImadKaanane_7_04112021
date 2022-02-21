module.exports = (req, res, next) => {
    const email = req.body.email
    if (email.indexOf("@groupomania.com", email.length - "@groupomania.com".length) !== -1) next()
    else return res.status(403).send("mail incorrect : exemple@groupomania.com")
}