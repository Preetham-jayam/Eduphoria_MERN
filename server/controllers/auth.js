const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'student',
        populate: [
          {
            path: 'courses',
            populate: {
              path: 'chapters',
              populate: {
                path: 'lessons',
              },
            },
          },
          {
            path: 'quizzes.course',
            select: 'quizzes.quiz quizzes.marks quizzes.totalMarks quizzes.answers',
          },
          {
            path: 'completedLessons',
          },
        ],
      })
      .populate({
        path: 'teacher',
        populate: {
          path: 'courses',
          populate: {
            path: 'chapters',
            populate: {
              path: 'lessons',
            },
          },
        },
      });

    if (!user) {
      const error = new HttpError('Could not find User for the provided id.', 404);
      return next(error);
    }

    res.json({ user: user.toObject({ getters: true }) });
    console.log(user);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a user.', 500);
    return next(error);
  }
};




exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    if (email === 'admin@gmail.com') {
      existingUser = await Admin.findOne({ email });
    } else {
      existingUser = await User.findOne({ email }).populate('student').populate('teacher');
    }
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials, could not log you in.', 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials, could not log you in.', 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1d' }
    );
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }

  

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role, 
    token: token,
  });
};


exports.Signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Invalid inputs passed, please check your data.' });
    }

    const data = req.body;
    console.log(data);
    const role = data.role;
    const email = data.email;
    const pwd = req.body.password;
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ message: 'User with this email already exists, please enter another' });
    }

    const hashedPwd = await bcrypt.hash(pwd, 12);

    const user = new User({
      email,
      password: hashedPwd,
      Imageurl: 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg',
      role,
    });

    if (role === 0) {
      const student = new Student({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNo: data.phoneNo,
        address: data.address,
        dateofbirth: data.dob,
        completedLessons: [],
        courses: [],
        quizzes: [],
      });

      await student.save();
      user.student = student;
    } else if (role === 1) {
      const teacher = new Teacher({
        FullName: data.fullName,
        InstName: data.instituteName,
        phoneNo: data.phoneNo,
        courses: [],
      });

      await teacher.save();
      user.teacher = teacher;
    }

    await user.save();

    return res.status(200).json({ user: user.toObject({ getters: true }) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.accountEdit = (req, res) => {
  let userId=req.params.userId;
  let {  email, currentPassword, newPassword } = req.body;
  User.findById(userId)
      .then((user) => {
          bcrypt.compare(currentPassword, user.password, (err, result) => {
              if (err) {
                  console.log(err);
                  res.status(500).json({ message: 'Internal server error' });
              }
              if (!result) {
                  console.log("Current password is incorrect");
                  res.status(400).json({ message: 'Current Password is incorrect' });
              } else {
                  bcrypt.hash(newPassword, 12)
                      .then((hashedPassword) => {
                          user.email = email;
                          user.password = hashedPassword;
                          user.save()
                              .then(() => {
                                  res.status(200).json({ message: "Password updated successfully" });
                              })
                              .catch((err) => {
                                  console.log(err);
                                  res.status(500).json({ message: 'Internal server error' });
                              });
                      })
                      .catch((err) => {
                          console.log(err);
                          res.status(500).json({ message: 'Internal server error' });
                      });
              }
          });
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Internal server error' });
      });
}





exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

