const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Review =require('../models/review');
const Quiz=require('../models/quiz');
const HttpError = require("../models/http-error");
const redisClient=require('../utils/Redis');

exports.getAllCourses = async (req, res, next) => {
  try {
      const cacheKey = 'all-courses';
      let courses = await redisClient.get(cacheKey);
      
      if (!courses) {
          courses = await Course.find().populate('teacher');
          redisClient.set(cacheKey, JSON.stringify(courses));
          console.log('Courses data set into Redis cache');
      } else {
          console.log('Courses data retrieved from Redis cache');
          courses = JSON.parse(courses);
      }

      res.status(200).json({ courses: courses });
  } catch (error) {
      const err = new HttpError('Could not get courses data', 500);
      return next(err);
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

    if (!course) {
      const error = new HttpError('Course not found', 404);
      throw error;
    }
    res.status(200).json({ course: course });
  } catch (error) {
    
    return next(error);
  }
};


exports.getCourseReviews = async (req,res,next)=>{
  try {
    const courseId = req.params.id;
    const reviews = await Review.find({ courseId: courseId });
    res.status(200).json({ reviews:reviews });
  } catch (error) {
    const err=new HttpError( 'Could not get course review data',500);
    return next(err);
  }
}

exports.getQuizByCourseId=async (req,res,next)=>{
  const courseId = req.params.id;
  try {
    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      throw new HttpError("Quiz not found for the given course Id",404);
     
    }
    res.status(200).json({ quiz:quiz });
  } catch (error) {
      return next(error);
  }
};
