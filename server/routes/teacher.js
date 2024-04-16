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
 * paths:
 *   /api/teacher/addcourse:
 *     post:
 *       summary: Add a new course
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the course
 *                 name:
 *                   type: string
 *                   description: The name of the course
 *                 description:
 *                   type: string
 *                   description: Description of the course
 *                 price:
 *                   type: number
 *                   description: The price of the course
 *                 teacher:
 *                   type: string
 *                   description: ID of the teacher associated with the course
 *                 instructorName:
 *                   type: string
 *                   description: Name of the instructor
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: The image file of the course
 *       responses:
 *         '201':
 *           description: Successfully added the course
 *         '401':
 *            description: Unauthorized Error
 *         '404':
 *           description: Teacher not found
 *           
 */

router.post('/addcourse', checkAuth, fileUpload.single('image'), TeacherController.addCourse);

/**
 * @swagger
 * paths:
 *   /api/teacher/editcourse/{courseId}:
 *     put:
 *       summary: Edit an existing course
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: courseId
 *           required: true
 *           description: ID of the course to edit
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The updated title of the course
 *                 name:
 *                   type: string
 *                   description: The updated name of the course
 *                 description:
 *                   type: string
 *                   description: The updated description of the course
 *                 price:
 *                   type: number
 *                   description: The updated price of the course
 *                 teacher:
 *                   type: string
 *                   description: The updated ID of the teacher associated with the course
 *                 instructorName:
 *                   type: string
 *                   description: The updated name of the instructor
 *                 image:
 *                   type: file
 *                   description: The updated image of the course
 *       responses:
 *         '200':
 *           description: Successfully updated the course
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Course not found
 */

router.put('/editcourse/:courseId',checkAuth,fileUpload.single('image'),TeacherController.editCourse);

/**
 * @swagger
 * paths:
 *   /api/teacher/addchapter/{courseId}:
 *     post:
 *       summary: Add a new chapter to a course
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: courseId
 *           required: true
 *           description: ID of the course to add the chapter to
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the chapter
 *                 description:
 *                   type: string
 *                   description: Description of the chapter
 *       responses:
 *         '201':
 *           description: Successfully added the chapter to the course
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Course not found
 */

router.post('/addchapter/:courseId', checkAuth, TeacherController.addChapter);

/**
 * @swagger
 * paths:
 *   /api/teacher/addlesson/{chapterId}:
 *     post:
 *       summary: Add a new lesson to a chapter
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: chapterId
 *           required: true
 *           description: ID of the chapter to add the lesson to
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: number
 *                   description: The number of the lesson
 *                 title:
 *                   type: string
 *                   description: The title of the lesson
 *                 description:
 *                   type: string
 *                   description: The description of the lesson
 *                 videoFile:
 *                   type: file
 *                   description: The video file for the lesson
 *       responses:
 *         '201':
 *           description: Successfully added the lesson
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Chapter not found
 *         '500':
 *           description: Internal Server Error
 */

router.post('/addlesson/:chapterId', checkAuth, fileUpload.single('videoFile'), TeacherController.addLesson);

/**
 * @swagger
 * paths:
 *   /api/teacher/updatechapter/{chapterId}:
 *     put:
 *       summary: Update a chapter
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: chapterId
 *           required: true
 *           description: ID of the chapter to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The updated name of the chapter
 *                 description:
 *                   type: string
 *                   description: The updated description of the chapter
 *       responses:
 *         '200':
 *           description: Successfully updated the chapter
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Chapter not found
 *         '500':
 *           description: Internal Server Error
 */

router.put('/updatechapter/:chapterId', checkAuth, TeacherController.updateChapter);

/**
 * @swagger
 * paths:
 *   /api/teacher/updatelesson/{lessonId}:
 *     put:
 *       summary: Update a lesson
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: lessonId
 *           required: true
 *           description: ID of the lesson to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: number
 *                   description: The updated lesson number
 *                 title:
 *                   type: string
 *                   description: The updated title of the lesson
 *                 description:
 *                   type: string
 *                   description: The updated description of the lesson
 *                 videoFile:
 *                   type: string
 *                   format: binary
 *                   description: The updated video file for the lesson
 *       responses:
 *         '200':
 *           description: Successfully updated the lesson
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Lesson not found
 *         '500':
 *           description: Internal Server Error
 */

router.put('/updatelesson/:lessonId', checkAuth, fileUpload.single('videoFile'), TeacherController.updateLesson);

/**
 * @swagger
 * paths:
 *   /api/teacher/deletelesson/{lessonId}:
 *     delete:
 *       summary: Delete a lesson
 *       tags: [Teacher]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: lessonId
 *           required: true
 *           description: ID of the lesson to delete
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully deleted the lesson
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Message indicating successful deletion
 *         '401':
 *           description: Unauthorized access
 *         '404':
 *           description: Lesson not found
 *         '500':
 *           description: Internal Server Error
 */

router.delete('/deletelesson/:lessonId', checkAuth, TeacherController.deleteLesson);

/**
 * @swagger
 * paths:
 *   /api/teacher/addquiz/{cid}:
 *     post:
 *       summary: Add or update a quiz for a course
 *       tags: [Teacher]
 *       security:
 *          - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: cid
 *           required: true
 *           description: ID of the course to add or update the quiz
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Title of the quiz
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                         description: The question text
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Array of options for the question
 *                       answer:
 *                         type: string
 *                         description: Correct answer for the question
 *                       marks:
 *                         type: number
 *                         description: Marks allocated for the question
 *       responses:
 *         '200':
 *           description: Quiz added or updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Message indicating successful addition or update
 *         '404':
 *           description: Course not found
 *         '500':
 *           description: Internal Server Error
 */

router.post('/addquiz/:cid', checkAuth,TeacherController.addQuizToCourse);

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
