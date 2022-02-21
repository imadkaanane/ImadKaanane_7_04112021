const router = require("express").Router()
const userCtrl = require("../controllers/userCtrl")
const multer = require("../middleware/multer-config")
const auth = require("../middleware/auth")
const verifyMail = require("../middleware/verifyMail")
const passwordCtrl = require("../middleware/verifyPassword")
const limiter = require('../middleware/rate-limiter')



router.post("/signup", multer, verifyMail, passwordCtrl.verifyPassword, passwordCtrl.verifySamePasswords, userCtrl.signup)
router.post("/login", limiter, verifyMail, passwordCtrl.verifyPassword, userCtrl.login) 
router.get("/", auth, userCtrl.getAllUser)
router.delete("/user/:email", auth, userCtrl.deleteOneUser)
router.delete("/", auth, userCtrl.deleteUser)
router.put("/", auth, multer, userCtrl.modifyUser)
router.put("/password", auth, passwordCtrl.verifyPassword, passwordCtrl.verifySamePasswords, userCtrl.modifyPassword)


module.exports = router;