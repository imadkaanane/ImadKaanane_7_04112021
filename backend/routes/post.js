const router = require("express").Router()
const postCtrl = require("../controllers/postCtrl")
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');



router.post("/", auth, multer, postCtrl.createPost)
router.get("/", auth, postCtrl.getAllPosts)
router.delete("/:id", auth, postCtrl.deletePost)

module.exports = router;