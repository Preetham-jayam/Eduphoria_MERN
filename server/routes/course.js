const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *         name:
 *           type: string
 *           description: The name of the course
 *         description:
 *           type: string
 *           description: Description of the course
 *         Imageurl:
 *           type: string
 *           description: URL of the course image
 *         price:
 *           type: number
 *           description: Price of the course
 *         instructorName:
 *           type: string
 *           description: Name of the instructor
 *         teacher:
 *           type: string
 *           description: ID of the teacher associated with the course
 *         students:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of the students enrolled in the course
 *         chapters:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of the chapters in the course
 *         quizzes:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of the quizzes in the course
 *       required:
 *         - title
 *         - name
 *         - price
 *         - teacher
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the chapter
 *         description:
 *           type: string
 *           description: Description of the chapter
 *         course:
 *           type: string
 *           description: ID of the course associated with the chapter
 *         lessons:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of the lessons in the chapter
 *       required:
 *         - name
 *         - course
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       properties:
 *         number:
 *           type: number
 *           description: The number of the lesson
 *         title:
 *           type: string
 *           description: The title of the lesson
 *         description:
 *           type: string
 *           description: Description of the lesson
 *         videoUrl:
 *           type: string
 *           description: URL of the video related to the lesson
 *         chapter:
 *           type: string
 *           description: ID of the chapter associated with the lesson
 *         checked:
 *           type: number
 *           description: Indicates whether the lesson has been checked or not (0 for unchecked, 1 for checked)
 *       required:
 *         - number
 *         - title
 *         - chapter
 */


/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API endpoints for courses
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *       500:
 *         description: Failed to get courses data
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{cid}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID of the course to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course data retrieved successfully
 *       500:
 *         description: Failed to get course data
 */
router.get('/:cid', courseController.getCourseById);

/**
 * @swagger
 * /api/courses/reviews/{id}:
 *   get:
 *     summary: Get reviews of a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to retrieve reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course reviews retrieved successfully
 *       500:
 *         description: Failed to get course review data
 */
router.get('/reviews/:id', courseController.getCourseReviews);

/**
 * @swagger
 * /api/courses/{id}/quiz:
 *   get:
 *     summary: Get quiz of a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to retrieve quiz for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz for the course retrieved successfully
 *       404:
 *         description: Quiz not found for the given course ID
 *       500:
 *         description: Internal server error
 */
router.get('/:id/quiz', courseController.getQuizByCourseId);

module.exports = router;
