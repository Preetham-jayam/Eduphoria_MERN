const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const User = require('../models/user');
const Teacher = require('../models/teacher');
const Student = require("../models/student");

exports.registerAdmin = async (req, res, next) => {
  const { FullName, phoneNo, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'User with this email already exists, please enter another' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(422).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      FullName,
      phoneNo,
      password: hashedPassword,
      email,
    });

    await newAdmin.save();

    const newUser = new User({
      email,
      password: hashedPassword,
      Imageurl: 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
      role: 2,
      admin:newAdmin._id
    });

    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.pendingTeachers = async (req, res) => {
  try {
    const users = await User.find({ role: 1 }).populate({
      path: 'teacher',
      populate: {
        path: 'courses',
        model: 'Course',
      },
    });

    const pendingTeachers = users.filter(user => user.teacher.flag === 0);

    res.status(200).json({
      success: true,
      message: 'Pending Teachers retrieved successfully',
      teachers: pendingTeachers,
    });
  } catch (error) {
    console.error('Error fetching pending teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.acceptTeacher = async (req, res) => {
  const id = req.params.id;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
    teacher.flag = 1;
    await teacher.save();
    res.status(200).json({
      success: true,
      message: 'Teacher accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.declineTeacher = async (req, res) => {
  const id = req.params.id;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }
    teacher.flag = 2;
    await teacher.save();
    res.status(200).json({
      success: true,
      message: 'Teacher declined successfully',
    });
  } catch (error) {
    console.error('Error declining teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.BlockUser = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      user.flag = user.flag === 0 ? 1 : 0;
      return user.save();
    })
    .then((updatedUser) => {
      let successMessage = updatedUser.flag === 1 ? "User blocked successfully." : "User unblocked successfully.";
      

      return res.status(200).json({ success: true, message: successMessage });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    });
};

exports.DeleteUser = (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findByIdAndDelete(id).then((user) => {
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let model = user.role === 0 ? Student : Teacher;
    let modelName = user.role === 0 ? "Student" : "Teacher";

    model.findByIdAndDelete(user.student || user.teacher)
      .then(() => {
        return res.status(200).json({ success: true, message: `${modelName} deleted successfully.` });
      })
      .catch((err) => {
        console.log(err);
        console.log("Internal server error");
        return res.status(500).json({ success: false, message: "Internal server error" });
      });
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  });
};