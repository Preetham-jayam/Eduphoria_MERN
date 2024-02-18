const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Quiz=require('../models/quiz');

exports.getTeacherById = async (req,res,next)=>{
  const userId=req.user.userId;
  const UserObj=await User.findById(userId);
  const teacher_Id=UserObj.teacher;

  const teacher = await Teacher.findById(teacher_Id);

  res.status(201).json(teacher);

}

exports.addCourse = async (req, res, next) => {
  
  const { title, name, description, price,teacher,instructorName } = req.body;
  const image = req.file;
  const Imageurl = image.path;

  try {
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
      return res.status(404).json({ message: "Teacher not found." });
    }

    teacherUser.courses.push(courseId);
    await teacherUser.save();

    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Adding course failed, please try again later." });
  }
};
exports.addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const { name, description } = req.body;
  

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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
    console.error('Error adding chapter:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { number, title, description } = req.body;
    const video=req.file;
    const videoUrl=video.path;

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

exports.updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { name, description } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      { name, description },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.status(200).json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { number, title, description, videoUrl } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { number, title, description, videoUrl },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findByIdAndDelete(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addQuizToCourse = async (req, res, next) => {
  const courseId = req.params.cid;
  const { title, questions } = req.body;

  try {
    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
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
    res.status(500).json({ message: "Adding/updating quiz failed, please try again later.", error: error.message });
  }
};

exports.updateQuiz = async (req, res, next) => {
    const quizId = req.params.quizId;
    const { title, questions } = req.body;
  
    try {
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
      }
  
      quiz.title = title;
      quiz.questions = questions;
  
      await quiz.save();
  
      res.status(200).json(quiz);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Updating quiz failed, please try again later." });
    }
  };
  
  exports.updateProfile = async (req, res) => {
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
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      res.status(200).json(updatedTeacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
