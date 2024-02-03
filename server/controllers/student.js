const Course = require("../models/course");
const Student = require("../models/student");
const Review = require("../models/review");
const User = require("../models/user");
exports.enrollCourse = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.params.sid;

  const user = await User.findById(userId);
  const studentId = user.student;

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      return Course.findById(courseId).populate("students");
    })
    .then((course) => {
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
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
      res
        .status(500)
        .json({ error: `Error enrolling student in course: ${err.message}` });
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
      res.status(500).json({ message: "Unable to add review" });
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
    res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

