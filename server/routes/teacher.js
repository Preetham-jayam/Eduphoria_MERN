const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/isAuth');
const TeacherController = require('../controllers/Teacher');

router.post('/addcourse', checkAuth, fileUpload.single('image'), TeacherController.addCourse);
router.post('/addchapter/:courseId', checkAuth, TeacherController.addChapter);
router.post('/addlesson/:chapterId', checkAuth, fileUpload.single('video'), TeacherController.addLesson);

router.put('/updatechapter/:chapterId', checkAuth, TeacherController.updateChapter);
router.put('/updatelesson/:lessonId', checkAuth, TeacherController.updateLesson);

router.delete('/deletelesson/:lessonId', checkAuth, TeacherController.deleteLesson);

module.exports = router;
