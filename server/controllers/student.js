const Course = require("../models/course");
const Student = require("../models/student");
const Review = require("../models/review");
const User = require("../models/user");
const HttpError = require('../models/http-error');
exports.enrollCourse = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.params.sid;

  const user = await User.findById(userId);
  const studentId = user.student;

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        throw new HttpError("Student Not found",404);
       
      }
      return Course.findById(courseId).populate("students");
    })
    .then((course) => {
      if (!course) {
        throw new HttpError("Course Not found",404);
      }
      if (
        course.students.some((student) => student._id.toString() === studentId)
      ) {
        return res
          .status(400)
          .json({ error: "Student is already enrolled in the course" });
      }

      return Promise.all([
        Student.findByIdAndUpdate(studentId, { $push: { courses: courseId } }),
        Course.findByIdAndUpdate(courseId, { $push: { students: studentId } }),
      ]);
    })
    .then(() => {
      res
        .status(200)
        .json({ message: "Student has been enrolled in the course" });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.postAddReview = (req, res) => {
  const reviewData = {
    courseId: req.params.id,
    studentName: req.body.studentName,
    rating: parseInt(req.body.rating, 10),
    comment: req.body.comment,
    todaysdate: req.body.todaysdate,
  };

  const review = new Review(reviewData);

  review
    .save()
    .then(() => {
      res.status(200).json({ message: "Review added successfully" });
    })
    .catch((err) => {
      const error=new HttpError("Unable to add review",500);
      return next(error);
    });
};

exports.updateCompletedLessons = async (req, res, next) => {
  const { id } = req.params;
  const { completedLessons } = req.body;

  try {
    const updatedUser = await Student.findByIdAndUpdate(
      id,
      { completedLessons },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    const err=new HttpError("Internal server error",500);
    return next(err);
  }
};

exports.updateProfile = async (req, res) => {
  const { studentId } = req.params;
  const updates = req.body;

  try {
    const updateFields = {};
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        updateFields[key] = updates[key];
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedStudent) {
      throw new HttpError("Student not found",404);
    }

    res.status(200).json({student:updatedStudent});
  } catch (error) {
    return next(error);
  }
};

exports.updateQuizResults = async (req, res) => {
  const { studentId, quizId, courseId, marks, totalMarks, answers } = req.body;
  try {
    const student = await Student.findById(studentId);

    if (!student) {
      throw new HttpError("Student not found",404);
    }

    const quizIndex = student.quizzes.findIndex(
      (quiz) => quiz.course.toString() === courseId && quiz.quiz.toString() === quizId
    );

    if (quizIndex !== -1) {
      student.quizzes[quizIndex] = {
        course: courseId,
        quiz: quizId,
        marks,
        totalMarks,
        answers
      };
    } else {
      student.quizzes.push({
        course: courseId,
        quiz: quizId,
        marks,
        totalMarks,
        answers
      });
    }

    await student.save();

    res.status(200).json({ message: 'Quiz results updated successfully' });
  } catch (error) {
     return next(error);
  }
};

