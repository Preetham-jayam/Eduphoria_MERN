const express=require('express');
const router=express.Router();
const checkAuth=require('../middleware/isAuth');
const StudentController =require('../controllers/student');

router.patch('/updateCompletedLessons/:id',checkAuth,StudentController.updateCompletedLessons);
router.post('/addreview/:id',checkAuth,StudentController.postAddReview);
router.post('/:sid/enrollcourse/:id',checkAuth,StudentController.enrollCourse);
router.put('/updateprofile/:studentId',checkAuth, StudentController.updateProfile);
module.exports = router;