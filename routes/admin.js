const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authentication } = require('../middlewares/authentication')
// const { authorization, authorizationForStatus } = require('../middlewares/authorization')


router.post('/login', adminController.loginUser)
// router.post('/google-signin', adminController.loginGoogle)

router.use(authentication)

router.post('/register', adminController.registerUser)
// router.get('/scholarships', adminController.getAllScholarships)
// router.post('/scholarships', adminController.postScholarships)
// router.get('/scholarships/:scholarshipId', adminController.getScholarshipsById)
// router.put('/scholarships/:scholarshipId', adminController.putScholarshipsById)
// router.delete('/scholarships/:scholarshipId',  adminController.deleteScholarshipsById)

// router.get('/threads', adminController.getAllThreads)
// router.patch('/threads/:threadsId', adminController.patchThreadsById)

// router.get('/mentoring', adminController.getAllMentoring)
// router.patch('/mentoring/:mentoringId', adminController.patchMentoringById)


module.exports = router