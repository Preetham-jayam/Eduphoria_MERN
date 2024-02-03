const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Review =require('../models/review');

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('teacher');
    res.status(200).json({courses:courses});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetching courses failed, please try again later." });
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.cid).populate([
      {
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
      },
      {
        path: 'chapters',
        populate: {
          path: 'lessons',
        },
      },
    ]);
    res.status(200).json({ course: course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetching course failed, please try again later." });
  }
};


exports.getCourseReviews = async (req,res,next)=>{
  try {
    const courseId = req.params.id;
    const reviews = await Review.find({ courseId: courseId });
    res.status(200).json({ reviews:reviews });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
