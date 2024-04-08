const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/isAuth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         FullName:
 *           type: string
 *           description: The full name of the admin
 *         phoneNo:
 *           type: string
 *           description: The phone number of the admin
 *         password:
 *           type: string
 *           description: The password of the admin
 *         email:
 *           type: string
 *           description: The email address of the admin
 *         role:
 *           type: number
 *           default: 2
 *           description: Role of the admin (0 for student, 1 for teacher, 2 for admin)
 *       required:
 *         - FullName
 *         - phoneNo
 *         - password
 *         - email
 */


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API endpoints for admin actions
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       422:
 *         description: User with this email already exists or Admin already exists
 *       500:
 *         description: Failed to register admin
 */
router.post("/register", checkAuth, adminController.registerAdmin);

/**
 * @swagger
 * /api/admin/pending-teachers:
 *   get:
 *     summary: Get pending teachers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending teachers retrieved successfully
 *       500:
 *         description: Failed to retrieve teachers
 */
router.get('/pending-teachers', checkAuth, adminController.pendingTeachers);

/**
 * @swagger
 * /api/admin/accept-teacher/{id}:
 *   patch:
 *     summary: Accept teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the teacher
 *     responses:
 *       200:
 *         description: Teacher accepted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Failed to accept teacher
 */
router.patch('/accept-teacher/:id', adminController.acceptTeacher);

/**
 * @swagger
 * /api/admin/decline-teacher/{id}:
 *   patch:
 *     summary: Decline teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the teacher
 *     responses:
 *       200:
 *         description: Teacher declined successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Failed to decline teacher
 */
router.patch('/decline-teacher/:id', adminController.declineTeacher);

/**
 * @swagger
 * /api/admin/block-user/{id}:
 *   patch:
 *     summary: Block/Unblock user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User blocked/unblocked successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to block/unblock user
 */
router.patch('/block-user/:id', adminController.BlockUser);

/**
 * @swagger
 * /api/admin/delete-user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete('/delete-user/:id', adminController.DeleteUser);

/**
 * @swagger
 * /api/admin/send-mail:
 *   post:
 *     summary: Send mail to all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mail sent to all users
 *       404:
 *         description: No users found
 *       500:
 *         description: Failed to send mail
 */
router.post('/send-mail', checkAuth, adminController.postsendmail);

/**
 * @swagger
 * /api/admin/delete-course/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to delete course
 */
router.delete('/delete-course/:id', checkAuth, adminController.deleteCourse);

/**
 * @swagger
 * /api/admin/add-course:
 *   post:
 *     summary: Add new course
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               teacher:
 *                 type: string
 *               instructorName:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course added successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Failed to add course
 */
router.post('/add-course', checkAuth, fileUpload.single('image'), adminController.AdminAddCourse);

module.exports = router;
