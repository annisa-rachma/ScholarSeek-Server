const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const { authentication } = require('../middlewares/authentication')


router.post('/login', clientController.loginUser)
router.post('/register/awardee', clientController.registerUserAwardee)
router.post('/register/mentee', clientController.registerUserMentee)


// router.get('/scholarships', clientController.getAllScholarships)
// router.get('/scholarships/:scholarshipId', clientController.getScholarshipsById)

router.use(authentication)

// router.get('/threads', clientController.getAllThreads)
// router.get('/threads/:threadsId', clientController.getThreadsById) //include comments
// router.post('/threads', clientController.postThreads)


// router.get('/mentoring', clientController.getAllMentoring)
// router.get('/mentoring/:mentoringId', clientController.getMentoringById)

// router.get('/profile/:userId', clientController.getProfileById)

// router.get('/bookmarks/scholarships', clientController.getAllBookmarkScholarship)
// router.get('/bookmarks/threads', clientController.getAllBookmarkThreads)
// router.get('/bookmarks/mentoring', clientController.getAllBookmarkMentoring)


module.exports = router