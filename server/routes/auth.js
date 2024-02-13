const express = require("express");
const { check } = require('express-validator');
const router = express.Router();
const authController = require("../controllers/auth");
const checkAuth=require('../middleware/isAuth');

router.get('/',authController.getUsers);
router.delete('/:id',authController.DeleteUser);
router.post("/login", authController.Login);
router.post("/signup",[
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ], authController.Signup);

router.get('/profile',authController.getUserProfile);
router.get('/:id',authController.getUserProfile);
router.put('/:userId', checkAuth,authController.accountEdit);

module.exports = router;
