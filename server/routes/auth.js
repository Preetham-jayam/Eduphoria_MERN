const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const authController = require("../controllers/auth");
const checkAuth = require('../middleware/isAuth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         Imageurl:
 *           type: string
 *           description: URL of the user's image
 *         student:
 *           type: string
 *           description: ID of the student associated with the user
 *         teacher:
 *           type: string
 *           description: ID of the teacher associated with the user
 *         admin:
 *           type: string
 *           description: ID of the admin associated with the user
 *         role:
 *           type: number
 *           description: Role of the user (0 for student, 1 for teacher, 2 for admin)
 *         flag:
 *           type: number
 *           description: Flag indicating user status 
 *         resetPasswordToken:
 *           type: string
 *           description: Token used for resetting the user's password
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           description: Date and time when the password reset token expires
 *       required:
 *         - email
 *         - password
 *      
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authController.getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Authentication]
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
 */
router.delete('/:id', authController.DeleteUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Logging in failed
 */
router.post("/login", authController.Login);

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup successful
 *       422:
 *         description: Invalid inputs passed
 *       500:
 *         description: Signup failed
 */
router.post("/signup", [
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password').isLength({ min: 6 })
], authController.Signup);



/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Something went wrong, could not find a user
 */
router.get('/:id', authController.getUserProfile);

/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     summary: Update user account
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Current Password is incorrect
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', checkAuth, authController.accountEdit);

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send mail
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       404:
 *         description: Invalid or expired token
 *       500:
 *         description: Could not reset password
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
