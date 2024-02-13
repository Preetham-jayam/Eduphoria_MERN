import React from "react";
import CourseCard from "./CourseCard";
import "./CourseList.css";
import { useNavigate } from "react-router-dom";


const EnrolledCourseList = ({user, courses }) => {
  const navigate=useNavigate();
  const handleReadMore = (course) => {
     navigate(`/courseContent/${course.id}`);
    
  };
  return (
    <>
      {user.role===0 && <h1 style={{textDecoration:'underline'}}>Your Enrolled Courses</h1>}
      {user.role===1 && <h1 style={{textDecoration:'underline'}}>Your Teaching Courses</h1>}
      <div className="course-list">
        {courses.length===0 && <h2>No courses enrolled</h2>}
        {courses.map((course) => (
          <CourseCard key={course.id} user={user} course={course} onReadMoreClick={handleReadMore} enrolled={true}/>
        ))}
      </div>
    </>
  );
};

export default EnrolledCourseList;
