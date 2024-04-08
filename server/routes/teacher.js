const express = require("express");
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/isAuth');
const TeacherController = require('../controllers/Teacher');

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         FullName:
 *           type: string
 *           description: The full name of the teacher
 *         InstName:
 *           type: string
 *           description: The name of the institution the teacher belongs to
 *         phoneNo:
 *           type: string
 *           description: The phone number of the teacher
 *         courses:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of the course associated with the teacher
 *           description: List of courses taught by the teacher
 *         flag:
 *           type: number
 *           default: 0
 *           description: Flag indicating teacher status
 *       required:
 *         - FullName
 *         - InstName
 *         - phoneNo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the quiz
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the question
 *               question:
 *                 type: string
 *                 description: The question itself
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of options for the question
 *               answer:
 *                 type: string
 *                 description: The correct answer to the question
 *               marks:
 *                 type: number
 *                 description: The marks assigned to the question
 *       required:
 *         - title
 *         - questions
 *         - course
 */


/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: API endpoints for teacher operations
 */

/**
 * @swagger
 * /api/teacher/addcourse:
 *   post:
 *     summary: Add a new course
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Image file for the course
 *       - in: formData
 *         name: FullName
 *         type: string
 *         required: true
 *         description: Teacher's full name
 *       - in: formData
 *         name: InstName
 *         type: string
 *         required: true
 *         description: Institute name
 *       - in: formData
 *         name: phoneNo
 *         type: string
 *         required: true
 *         description: Phone number
 *     responses:
 *       200:
 *         description: Course added successfully
 */
router.post('/addcourse', checkAuth, fileUpload.single('image'), TeacherController.addCourse);

/**
 * @swagger
 * /api/teacher/addchapter/{courseId}:
 *   post:
 *     summary: Add a new chapter to a course
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         type: string
 *         required: true
 *         description: ID of the course to which the chapter belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterName:
 *                 type: string
 *                 description: Name of the chapter
 *     responses:
 *       200:
 *         description: Chapter added successfully
 */
router.post('/addchapter/:courseId', checkAuth, TeacherController.addChapter);

/**
 * @swagger
 * /api/teacher/addlesson/{chapterId}:
 *   post:
 *     summary: Add a new lesson to a chapter
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         type: string
 *         required: true
 *         description: ID of the chapter to which the lesson belongs
 *       - in: formData
 *         name: videoFile
 *         type: file
 *         description: Video file for the lesson
 *     responses:
 *       200:
 *         description: Lesson added successfully
 */
router.post('/addlesson/:chapterId', checkAuth, fileUpload.single('videoFile'), TeacherController.addLesson);

/**
 * @swagger
 * /api/teacher/updatechapter/{chapterId}:
 *   put:
 *     summary: Update a chapter
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         type: string
 *         required: true
 *         description: ID of the chapter to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterName:
 *                 type: string
 *                 description: New name for the chapter
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 */
router.put('/updatechapter/:chapterId', checkAuth, TeacherController.updateChapter);

/**
 * @swagger
 * /api/teacher/updatelesson/{lessonId}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         type: string
 *         required: true
 *         description: ID of the lesson to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videoFile:
 *                 type: file
 *                 description: New video file for the lesson
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 */
router.put('/updatelesson/:lessonId', checkAuth, fileUpload.single('videoFile'), TeacherController.updateLesson);

/**
 * @swagger
 * /api/teacher/deletelesson/{lessonId}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         type: string
 *         required: true
 *         description: ID of the lesson to delete
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 */
router.delete('/deletelesson/:lessonId', checkAuth, TeacherController.deleteLesson);

/**
 * @swagger
 * /api/teacher/addquiz/{cid}:
 *   post:
 *     summary: Add a quiz to a course
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: cid
 *         type: string
 *         required: true
 *         description: ID of the course to which the quiz belongs
 *     responses:
 *       200:
 *         description: Quiz added successfully
 */
router.post('/addquiz/:cid', TeacherController.addQuizToCourse);

/**
 * @swagger
 * /api/teacher/updateprofile/{teacherId}:
 *   put:
 *     summary: Update teacher profile
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         type: string
 *         required: true
 *         description: ID of the teacher to update profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *                 description: New full name
 *               InstName:
 *                 type: string
 *                 description: New institute name
 *               phoneNo:
 *                 type: string
 *                 description: New phone number
 *     responses:
 *       200:
 *         description: Teacher profile updated successfully
 */
router.put('/updateprofile/:teacherId', checkAuth, TeacherController.updateProfile);

module.exports = router;
