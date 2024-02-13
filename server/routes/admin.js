const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const checkAuth=require('../middleware/isAuth');

router.post("/register",checkAuth, adminController.registerAdmin);
router.get('/pending-teachers',checkAuth,adminController.pendingTeachers);
router.patch('/accept-teacher/:id', adminController.acceptTeacher);
router.patch('/decline-teacher/:id', adminController.declineTeacher);
router.patch('/block-user/:id',adminController.BlockUser);
router.delete('/delete-user/:id',adminController.DeleteUser);

module.exports = router;
