const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/isAuth');
const StudentController = require('../controllers/student');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the student
 *         lastName:
 *           type: string
 *           description: The last name of the student
 *         phoneNo:
 *           type: string
 *           description: The phone number of the student
 *         dateofbirth:
 *           type: string
 *           format: date
 *           description: The date of birth of the student
 *         address:
 *           type: string
 *           description: The address of the student
 *         courses:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of the course associated with the student
 *           description: List of courses the student is enrolled in
 *         quizzes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *                 description: ID of the course associated with the quiz
 *               quiz:
 *                 type: string
 *                 description: ID of the quiz associated with the student
 *               marks:
 *                 type: number
 *                 description: Marks obtained by the student in the quiz
 *               totalMarks:
 *                 type: number
 *                 description: Total marks available for the quiz
 *               answers:
 *                 type: string
 *                 description: JSON string representing the student's answers for the quiz
 *           description: List of quizzes attempted by the student
 *         completedLessons:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of the lesson completed by the student
 *           description: List of lessons completed by the student
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNo
 *         - dateofbirth
 *         - address
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           description: The ID of the course associated with the review
 *         studentName:
 *           type: string
 *           description: The name of the student who submitted the review
 *         rating:
 *           type: number
 *           description: The rating given by the student (from 1 to 5)
 *         comment:
 *           type: string
 *           description: The comment provided by the student
 *         todaysdate:
 *           type: string
 *           description: The date when the review was submitted
 *       required:
 *         - courseId
 *         - studentName
 *         - rating
 *         - comment
 *         - todaysdate
 */



/**
 * @swagger
 * tags:
 *   name: Student
 *   description: API endpoints for student operations
 */

/**
 * @swagger
 * /api/student/updateCompletedLessons/{id}:
 *   patch:
 *     summary: Update completed lessons of a student
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completedLessons:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Completed lessons updated successfully
 */
router.patch('/updateCompletedLessons/:id', checkAuth, StudentController.updateCompletedLessons);

/**
 * @swagger
 * /api/student/addreview/{id}:
 *   post:
 *     summary: Add a review for a course
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentName:
 *                 type: string
 *                 description: Name of the student
 *               rating:
 *                 type: integer
 *                 description: Rating of the course
 *               comment:
 *                 type: string
 *                 description: Comment for the course
 *               todaysdate:
 *                 type: string
 *                 description: Current date
 *     responses:
 *       200:
 *         description: Review added successfully
 */
router.post('/addreview/:id', checkAuth, StudentController.postAddReview);

/**
 * @swagger
 * /api/student/{sid}/enrollcourse/{id}:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sid
 *         type: string
 *         required: true
 *         description: ID of the student
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Student enrolled in the course successfully
 */
router.post('/:sid/enrollcourse/:id', checkAuth, StudentController.enrollCourse);

/**
 * @swagger
 * /api/student/updateprofile/{studentId}:
 *   put:
 *     summary: Update student profile
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         type: string
 *         required: true
 *         description: ID of the student
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
 *         description: Student profile updated successfully
 */
router.put('/updateprofile/:studentId', checkAuth, StudentController.updateProfile);

/**
 * @swagger
 * /api/student/updateQuizResults/{studentId}:
 *   patch:
 *     summary: Update quiz results for a student
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         type: string
 *         required: true
 *         description: ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quizId:
 *                 type: string
 *                 description: ID of the quiz
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               marks:
 *                 type: integer
 *                 description: Marks obtained in the quiz
 *               totalMarks:
 *                 type: integer
 *                 description: Total marks of the quiz
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Answers submitted by the student
 *     responses:
 *       200:
 *         description: Quiz results updated successfully
 */
router.patch('/updateQuizResults/:studentId',checkAuth, StudentController.updateQuizResults);

module.exports = router;
