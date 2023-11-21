const express = require('express')
const router = express.Router()
const { authentication } = require('../middlewares/authentication')
const multer = require('../middlewares/multer')
const UserController = require('../controllers/UserController')
const ScholarshipController = require('../controllers/scholarshipController')
const ThreadController = require('../controllers/threadController')
const CommentContoroller = require('../controllers/commentController')
const MentoringController = require('../controllers/mentoringController')

router.post('/login', UserController.loginUser)
router.post('/register/awardee', multer.single('image'), UserController.registerUserAwardee)
router.post('/register/mentee', multer.single('image'), UserController.registerUserMentee)

router.get('/scholarships', ScholarshipController.getAllScholarships)
router.get('/scholarships/:slug', ScholarshipController.getScholarshipsById)

router.use(authentication)

router.get('/profile/:slug', UserController.getProfileById)

router.post('/scholarships/:slug', UserController.postBookmarkScholarship)

router.get('/threads', ThreadController.getAllThreads)
router.post('/threads', ThreadController.postThreads)
router.get('/threads/:threadsId', ThreadController.getThreadsById) //include comments
// router.put('/threads/:threadsId, clientController.putLikeDislikeThreads)
router.post('/threads/:threadsId/comment', CommentContoroller.postComments)
router.post('/threads/:threadsId/bookmarks', UserController.postBookmarkThreads)
// router.put('/comments/:commentId, clientController.putLikeDislikeComments)

router.get('/mentoring', MentoringController.getAllMentoring)
router.post('/mentoring', MentoringController.postMentoring)
router.get('/mentoring/:slug', MentoringController.getMentoringById)
router.post('/mentoring/:slug', UserController.postBookmarkMentoring)

router.get('/bookmarks/thread', UserController.getAllBookmarkThreads)
router.get('/bookmarks/scholarships', UserController.getAllBookmarkScholarship)
router.get('/bookmarks/mentoring', UserController.getAllBookmarkMentoring)




module.exports = router