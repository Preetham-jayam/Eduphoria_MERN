const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const fileUpload = require('../middleware/fileUpload');
const checkAuth=require('../middleware/isAuth');

router.post("/register",checkAuth, adminController.registerAdmin);
router.get('/pending-teachers',checkAuth,adminController.pendingTeachers);
router.patch('/accept-teacher/:id', adminController.acceptTeacher);
router.patch('/decline-teacher/:id', adminController.declineTeacher);
router.patch('/block-user/:id',adminController.BlockUser);
router.delete('/delete-user/:id',adminController.DeleteUser);
router.post('/send-mail',checkAuth,adminController.postsendmail);
router.delete('/delete-course/:id',checkAuth,adminController.deleteCourse);
router.post('/add-course',checkAuth,fileUpload.single('image'),adminController.AdminAddCourse);
module.exports = router;
