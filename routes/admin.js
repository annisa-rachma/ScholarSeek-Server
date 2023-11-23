const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authentication } = require('../middlewares/authentication')
const MentoringController = require('../controllers/mentoringController')
const ThreadController = require('../controllers/threadController')

router.post('/login', adminController.loginUser)

// router.use(authentication)

router.post('/register', adminController.registerUser)

router.get('/users', adminController.getAllUser)
router.patch('/users/:id', adminController.patchIsValidateUser)

router.get('/scholarships', adminController.getAllScholarships)
router.post('/scholarships', adminController.postScholarships)
router.get('/scholarships/:slug', adminController.getScholarshipsById)
router.put('/scholarships/:slug', adminController.putScholarshipsById)
router.delete('/scholarships/:slug',  adminController.deleteScholarshipsById)

router.get('/threads', ThreadController.getAllThreads)
router.patch('/threads/:threadsId', ThreadController.getThreadsById)

router.get('/mentoring', MentoringController.getAllMentoring)
router.patch('/mentoring/:slug', MentoringController.getMentoringById)



module.exports = router