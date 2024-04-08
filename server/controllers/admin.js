const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const User = require('../models/user');
const Teacher = require('../models/teacher');
const Student = require("../models/student");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const Course = require("../models/course");
const HttpError = require("../models/http-error");
const cloudinaryconfig = require("../cloudconfig");
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eduphoriaiiits@gmail.com",
    pass: "mknzpfpcncmrbgua",
  },
});

exports.registerAdmin = async (req, res, next) => {
  const { FullName, phoneNo, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError("User with this email already exists, please enter another",422);
      
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new HttpError("Admin already exists",422);
      
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
    return next(error);
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
    const err=new HttpError("failed to retrieve teachers",500);
    return next(err);
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
    const err=new HttpError("Failed to accept teachers",500);
    return next(err);
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
    const err=new HttpError("Failed to decline teacher",500);
    return next(err);
  }
};

exports.BlockUser = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new HttpError("User not found",404);
      }
      user.flag = user.flag === 0 ? 1 : 0;
      return user.save();
    })
    .then((updatedUser) => {
      let successMessage = updatedUser.flag === 1 ? "User blocked successfully." : "User unblocked successfully.";
      

      return res.status(200).json({ success: true, message: successMessage });
    })
    .catch((err) => {
     const error=new HttpError("Failed to block user",500);
     return next(error);
    });
};

exports.DeleteUser = (req, res) => {
  const id = req.params.id;
  console.log(id);
  User.findByIdAndDelete(id).then((user) => {
    if (!user) {
      throw new HttpError("User not found",404);
    }

    let model = user.role === 0 ? Student : Teacher;
    let modelName = user.role === 0 ? "Student" : "Teacher";

    model.findByIdAndDelete(user.student || user.teacher)
      .then(() => {
        return res.status(200).json({ success: true, message: `${modelName} deleted successfully.` });
      })
      .catch((err) => {
        const error=new HttpError("Failed to delete user",500);
        return next(error);
      });
  }).catch((err) => {
    const error=new HttpError("Failed to delete user",500);
     return next(error);
  });
};

exports.postsendmail = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const users = await User.find({ role: 0 }, "email");
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    const emailList = users.map((user) => user.email);

    const mailOptions = {
      from: "eduphoriaiiits@gmail.com",
      to: emailList.join(","),
      subject: subject,
      text: message,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    
    return res.status(200).json({ message: "Mail Sent to all users" });
  } catch (error) {
    const err=new HttpError("Failed to send mail",500);
    return next(err);
  }
};

exports.deleteCourse = (req, res) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
    .then((deletedCourse) => {
      if (!deletedCourse) {
        throw new HttpError("Course not found",404);
      }
      return Student.updateMany(
        { courses: id }, 
        { $pull: { courses: id } }
      );
    })
    .then(() => {
      console.log(`Course id ${id} deleted from all students`);
      res.status(200).json({ success: true, message: 'Course deleted successfully' });
    })
    .catch(err => {
      const error=new HttpError("Failed to delete course",500);
     return next(error);
    });
};

exports.AdminAddCourse = async (req, res, next) => {
  
  const { title, name, description, price,teacher,instructorName } = req.body;
 
  try {
    let image; 
    if (req.file) {
      const result = await cloudinaryconfig.v2.uploader.upload(req.file.path,{
        upload_preset: "eduphoria",
      }); 
      image = result.secure_url; 
    }
    const newCourse = new Course({
      title,
      name,
      description,
      Imageurl,
      price,
      teacher,
      instructorName
    });

    const result = await newCourse.save();
    const courseId = result._id;

    const teacherUser = await Teacher.findById(teacher);

    if (!teacherUser) {
      throw new HttpError("Teacher not found",404);
    }

    teacherUser.courses.push(courseId);
    await teacherUser.save();

    res.status(201).json(result);
  } catch (error) {
    const err=new HttpError("Failed to add course",500);
    return next(err);
  }
};
