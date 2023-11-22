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

router.get('/profile', (req, res) => res.status(200).json(req.user))

router.get('/profile/:slug', UserController.getProfileById)

router.post('/scholarships/:slug', UserController.postBookmarkScholarship)

router.get('/threads', ThreadController.getAllThreads)
router.post('/threads', ThreadController.postThreads)
router.get('/threads/:slug', ThreadController.getThreadsById) //include comments
// router.put('/threads/:slug, clientController.putLikeDislikeThreads)
router.post('/threads/:slug/comment', CommentContoroller.postComments)
router.post('/threads/:slug/bookmarks', UserController.postBookmarkThreads)
// router.put('/comments/:slug, clientController.putLikeDislikeComments)

router.get('/mentoring', MentoringController.getAllMentoring)
router.post('/mentoring', multer.single('image'), MentoringController.postMentoring)
router.get('/mentoring/:slug', MentoringController.getMentoringById)
router.post('/mentoring/:slug',  UserController.postBookmarkMentoring)
router.put('/mentoring/:slug', MentoringController.editStatusMentoring)

router.get('/bookmarks/thread', UserController.getAllBookmarkThreads)
router.get('/bookmarks/scholarships', UserController.getAllBookmarkScholarship)
router.get('/bookmarks/mentoring', UserController.getAllBookmarkMentoring)




module.exports = router