  const Course = require("../models/course");
  const Chapter = require("../models/chapter");
  const Lesson = require("../models/lesson");
  const Teacher = require("../models/teacher");
  const User = require("../models/user");
  const Quiz=require('../models/quiz');
  const HttpError = require("../models/http-error");
  const cloudinaryconfig = require("../cloudconfig");

  exports.getTeacherById = async (req,res,next)=>{
    const userId=req.user.userId;
    const UserObj=await User.findById(userId);
    const teacher_Id=UserObj.teacher;

    const teacher = await Teacher.findById(teacher_Id);

    res.status(201).json(teacher);

  }

  exports.addCourse = async (req, res, next) => {
    
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
        Imageurl:image,
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
      return next(error);
    }
  };

  exports.editCourse=async (req,res,next) =>{
    try{
      const {courseId} =req.params;
      const { title, name, description, price,teacher,instructorName } = req.body;
      let {Imageurl}=req.body;
      if (req.file) {

        const result = await cloudinaryconfig.v2.uploader.upload(req.file.path,{
          upload_preset: "eduphoria",
        }); 
        Imageurl = result.secure_url; 
      }
  
      const updatedCourse = await Course.findByIdAndUpdate(courseId,{
        title,
        name,
        description,
        Imageurl:Imageurl,
        price,
        teacher,
        instructorName
      },{new : true});

      if(!updatedCourse){
        throw new HttpError('Course Not Found',404);
      }

      res.status(200).json(updatedCourse);

    } catch(error){
      return next(error);
    }

  }
  exports.addChapter = async (req, res,next) => {
    try {
      const { courseId } = req.params;
      console.log(courseId);
      const { name, description } = req.body;
    

      const course = await Course.findById(courseId);

      if (!course) {
        throw new HttpError("Couldn't find the course for this chapter.", 404);
      }

      const newChapter = new Chapter({
        name,
        description,
        course: courseId,
      });

      await newChapter.save();

      course.chapters.push(newChapter);
      await course.save();

      res.status(201).json(newChapter);
    } catch (error) {
      return next(error);
    }
  };

  exports.addLesson = async (req, res,next) => {
    try {
      const { chapterId } = req.params;
      const { number, title, description } = req.body;
      const video = req.file;

      const result = await cloudinaryconfig.v2.uploader.upload(video.path, {
        resource_type: "video",
        upload_preset:'eduphoria'
      });
      const videoUrl = result.secure_url;


      const chapter = await Chapter.findById(chapterId);

      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }

      const newLesson = new Lesson({
        number,
        title,
        description,
        videoUrl,
        chapter: chapterId,
      });

      await newLesson.save();

      chapter.lessons.push(newLesson);
      await chapter.save();

      res.status(201).json({lesson:newLesson});
    } catch (error) {
      console.error('Error adding lesson:', error);
      res.status(500).json({ message: 'Internal Server Error',error:error });
    }
  };

  exports.updateChapter = async (req, res,next) => {
    try {
      const { chapterId } = req.params;
      const { name, description } = req.body;

      const chapter = await Chapter.findByIdAndUpdate(
        chapterId,
        { name, description },
        { new: true }
      );

      if (!chapter) {
        throw new HttpError("Chapter not found",404);
      }

      res.status(200).json(chapter);
    } catch (error) {
      return next(error);
    }
  };

  exports.updateLesson = async (req, res,next) => {
    try {
      const { lessonId } = req.params;
      const { number, title, description } = req.body;
      let { videoUrl } = req.body;

      if (req.file) {
        const video = req.file;

        const result = await cloudinaryconfig.v2.uploader.upload(video.path, {
          resource_type: "video",
          upload_preset:'eduphoria'
        });
        videoUrl = result.secure_url;
      }

      const lesson = await Lesson.findByIdAndUpdate(
        lessonId,
        { $set: { number, title, description, videoUrl } },
        { new: true } 
      );

      if (!lesson) {
        throw new HttpError("Lesson not found",404);
      }

      res.status(200).json({ lesson });
    } catch (error) {
      return next(error);
    }
  };

  exports.deleteLesson = async (req, res,next) => {
    try {
      const { lessonId } = req.params;

      const lesson = await Lesson.findByIdAndDelete(lessonId);

      if (!lesson) {
        throw new HttpError("Lesson not found",404);
      }

      res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      return next(error);
    }
  };

  exports.addQuizToCourse = async (req, res, next) => {
    const courseId = req.params.cid;
    const { title, questions } = req.body;

    try {
      let course = await Course.findById(courseId);

      if (!course) {
        throw new HttpError('Course not Found', 404);
      
      }

      let existingQuiz = await Quiz.findOne({ course: courseId });

      if (existingQuiz) {
        existingQuiz.title = title;
        existingQuiz.questions = questions;
        await existingQuiz.save();
      } else {
        const newQuiz = new Quiz({
          title,
          questions,
          course: courseId,
        });

        await newQuiz.save();

        course.quizzes.push(newQuiz._id);
        await course.save();

        res.status(201).json(newQuiz);
      }

      res.status(200).json({ message: "Quiz updated successfully." });
    } catch (error) {
      return next(error);
    }
  };

  exports.updateQuiz = async (req, res, next) => {
      const quizId = req.params.quizId;
      const { title, questions } = req.body;
    
      try {
        const quiz = await Quiz.findById(quizId);
    
        if (!quiz) {
          throw new HttpError("Quiz not found",404);
        }
    
        quiz.title = title;
        quiz.questions = questions;
    
        await quiz.save();
    
        res.status(200).json(quiz);
      } catch (error) {
        return next(error);
      }
    };
    
    exports.updateProfile = async (req, res,next) => {
      const { teacherId } = req.params;
      const updates = req.body;
    
      try {
        const updateFields = {};
        for (const key in updates) {
          if (updates.hasOwnProperty(key)) {
            updateFields[key] = updates[key];
          }
        }
    
        const updatedTeacher = await Teacher.findByIdAndUpdate(
          teacherId,
          { $set: updateFields },
          { new: true }
        );
    
        if (!updatedTeacher) {
          throw new HttpError("Teacher not found",404);

        }
    
        res.status(200).json(updatedTeacher);
      } catch (error) {
        return next(error);
      }
    };

   
