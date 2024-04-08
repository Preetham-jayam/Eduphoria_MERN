import React, { useState, useEffect } from "react";
import "./CourseCard.css";

const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p>
        <strong>{percentage}% Completed</strong>
      </p>
    </>
  );
};

const CourseProgress = ({ user, course }) => {
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const getCourseDetails = (course) => {
      if (course && course.chapters) {
        const totalLessonsCount = course.chapters.reduce(
          (count, chapter) => count + chapter.lessons.length,
          0
        );
        setTotalLessons(totalLessonsCount);
      }
    };
  
    const getCompletedLessons = (course, user) => {
      const studentCompletedLessons = user.student.completedLessons || [];
      const completedLessonIds = studentCompletedLessons.map(lesson => lesson._id);
      const completedLessonsCount = course.chapters.reduce((count, chapter) => {
        return count + chapter.lessons.filter(lesson => completedLessonIds.includes(lesson._id)).length;
      }, 0);
      
      setCompletedLessons(completedLessonsCount);
      console.log("Completed Lessons Count:", completedLessonsCount);
    };
    
   
    getCourseDetails(course);
    getCompletedLessons(course,user);
  }, [course, user]);
  

  return (
    <div className="course-progress">
      <ProgressBar completed={completedLessons} total={totalLessons} />
    </div>
  );
};

const CourseCard = ({user, course, onReadMoreClick, enrolled }) => {
  

  return (
    <div
      className="course-card"
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <img src={`${course.Imageurl}`} alt={course.title} className="course-image" />
      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        {!enrolled && <p className="course-price">₹{course.price}</p>}
        <p className="course-instructor">
          <b>Instructor</b>: {course.instructorName}
        </p>
        <p className="course-students">
          <b>Enrolled Students</b>: {course.students.length}
        </p>
        {!enrolled && (
          <button
            className="read-more-button"
            onClick={() => onReadMoreClick(course)}
          >
            Read More
          </button>
        )}
        {enrolled && (
          <button
            className="read-more-button"
            onClick={() => onReadMoreClick(course)}
          >
            Open Course
          </button>
        )}
        {enrolled && user.role === 0 && (
          <CourseProgress user={user} course={course} />
        )}
      </div>
    </div>
  );
};

export default CourseCard;
