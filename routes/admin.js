const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authentication } = require('../middlewares/authentication')

router.post('/login', adminController.loginUser)

router.use(authentication)

router.post('/register', adminController.registerUser)

// router.patch('/user', clientController.patchIsValidateUser)

router.get('/scholarships', adminController.getAllScholarships)
router.post('/scholarships', adminController.postScholarships)
router.get('/scholarships/:slug', adminController.getScholarshipsById)
router.put('/scholarships/:slug', adminController.putScholarshipsById)
router.delete('/scholarships/:slug',  adminController.deleteScholarshipsById)

// router.get('/threads', adminController.getAllThreads)
// router.patch('/threads/:threadsId', adminController.patchThreadsById)

// router.get('/mentoring', adminController.getAllMentoring)
// router.patch('/mentoring/:mentoringId', adminController.patchMentoringById)



module.exports = router