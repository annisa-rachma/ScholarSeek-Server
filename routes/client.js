const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { authentication } = require('../middlewares/authentication')
const multer = require('../middlewares/multer')

router.post('/login', clientController.loginUser)
router.post('/register/awardee', multer.single('image'), clientController.registerUserAwardee)
router.post('/register/mentee', multer.single('image'), clientController.registerUserMentee)

router.get('/scholarships', clientController.getAllScholarships)
router.get('/scholarships/:slug', clientController.getScholarshipsById)

router.use(authentication)

router.get('/profile/:slug', clientController.getProfileById)

router.post('/scholarships/:slug/bookmarks', clientController.postBookmarkScholarship)

router.get('/threads', clientController.getAllThreads)
router.post('/threads', clientController.postThreads)
router.get('/threads/:threadsId', clientController.getThreadsById) //include comments
// router.put('/threads/:threadsId, clientController.putLikeDislikeThreads)
router.post('/threads/:threadsId/comment', clientController.postComments)
router.post('/threads/:threadsId/bookmarks', clientController.postBookmarkThreads)
// router.put('/comments/:commentId, clientController.putLikeDislikeComments)

router.get('/mentoring', clientController.getAllMentoring)
router.post('/mentoring', clientController.postMentoring)
router.get('/mentoring/:slug', clientController.getMentoringById)
router.post('/mentoring/:slug/bookmarks', clientController.postBookmarkMentoring)

router.get('/bookmarks/thread', clientController.getAllBookmarkThreads)
router.get('/bookmarks/scholarships', clientController.getAllBookmarkScholarship)
router.get('/bookmarks/mentoring', clientController.getAllBookmarkMentoring)




module.exports = router