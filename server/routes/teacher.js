const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/isAuth');
const TeacherController = require('../controllers/Teacher');

router.post('/addcourse', checkAuth, fileUpload.single('image'), TeacherController.addCourse);
router.post('/addchapter/:courseId', checkAuth,TeacherController.addChapter);
router.post('/addlesson/:chapterId', checkAuth, fileUpload.single('videoFile'), TeacherController.addLesson);

router.put('/updatechapter/:chapterId', checkAuth, TeacherController.updateChapter);
router.put('/updatelesson/:lessonId', checkAuth, fileUpload.single('videoFile'),TeacherController.updateLesson);

router.delete('/deletelesson/:lessonId', checkAuth, TeacherController.deleteLesson);
router.post('/addquiz/:cid', TeacherController.addQuizToCourse);

router.put('/updateprofile/:teacherId',checkAuth,TeacherController.updateProfile);

module.exports = router;
