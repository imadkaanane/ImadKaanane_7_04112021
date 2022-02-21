const router = require("express").Router()
const commentsCtrl = require("../controllers/commentCtrl")
const auth = require('../middleware/auth');


router.post("/:id", auth, commentsCtrl.createComment) 
router.get("/:id", auth, commentsCtrl.getAllComments)
router.delete("/:id", auth, commentsCtrl.deleteComment)

module.exports = router;