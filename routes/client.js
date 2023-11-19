const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { authentication } = require('../middlewares/authentication')
const multer = require('../middlewares/multer')

router.post('/login', clientController.loginUser)
router.post('/register/awardee', multer.single('image'), clientController.registerUserAwardee)
router.post('/register/mentee', multer.single('image'), clientController.registerUserMentee)


router.get('/scholarships', clientController.getAllScholarships)
router.get('/scholarships/:scholarshipId', clientController.getScholarshipsById)

router.use(authentication)

router.get('/profile/:userId', clientController.getProfileById)

router.get('/threads', clientController.getAllThreads)
router.get('/threads/:threadsId', clientController.getThreadsById) //include comments
// router.post('/threads', clientController.postThreads)
// router.put('/threads/:threadsId, clientController.putLikeDislikeThreads)

// router.post('/comments', clientController.postComments)
// router.put('/comments/:commentId, clientController.putLikeDislikeComments)

// router.get('/mentoring', clientController.getAllMentoring)
// router.post('/mentoring', clientController.postMentoring)
// router.get('/mentoring/:mentoringId', clientController.getMentoringById)

// router.get('/bookmarks/scholarships', clientController.getAllBookmarkScholarship)
// router.get('/bookmarks/threads', clientController.getAllBookmarkThreads)
// router.get('/bookmarks/mentoring', clientController.getAllBookmarkMentoring)


module.exports = router