const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eduphoriaiiits@gmail.com",
    pass: "mknzpfpcncmrbgua",
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
     throw new HttpError("User not found",404);
    }

    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #333; margin-bottom: 20px;">
              You have requested to reset your password. Click the link below to reset your password:
            </p>
            <a href="http://localhost:3000/reset-password/${token}" 
              style="display: inline-block; padding: 10px 20px; background-color: #06bbcc; color: #fff; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">
              Reset Password
            </a>
            <p style="color: #333; margin-bottom: 20px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });
    
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    const err=new HttpError("Failed to send mail");
    return next(err);
  }
};


exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      const error=new HttpError("Invalid or expired token",404);
      return next(error);
     
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    const error=new HttpError('Could not reset password',500);
    return next(error);
  }
};

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
      })
      .populate('admin')
      ;

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
    if (email === process.env.ADMIN_EMAIL) { 
      existingUser = await User.findOne({ email }).populate('admin');
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

  if (existingUser.flag === 1) {
    const error = new HttpError('Your account has been blocked by the admin.', 403);
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
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const data = req.body;
    const role = data.role;
    const email = data.email;
    const pwd = req.body.password;
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new HttpError('User with this email already exists, please enter another', 422);
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
    return next(err); 
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
    users = await User.find({ role: { $ne: 2 }}, '-password').populate({
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
    })
  
    ;
;
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

exports.DeleteUser = (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findByIdAndDelete(id).then((user) => {
    if (!user) {
      const error=new HttpError("User not found", 404);
      return next(error);
      
    }

    let model = user.role === 0 ? Student : Teacher;
    let modelName = user.role === 0 ? "Student" : "Teacher";

    model.findByIdAndDelete(user.student || user.teacher)
      .then(() => {
        return res.status(200).json({ success: true, message: `${modelName} deleted successfully.` });
      })
      .catch((err) => {
       const error=new HttpError(`${model} not found`,404);
       return next(error);
      });
  }).catch((err) => {
    const error = new HttpError(
      'Deleting user failed, please try again later.',
      500
    );
    return next(error);
  });
};