import React from "react";
import CourseCard from "./CourseCard";
import "./CourseList.css";
import { useNavigate } from "react-router-dom";

const CourseList = ({ courses }) => {
  const navigate=useNavigate();
  const handleReadMore = (course) => {
    navigate(`/courseDetails/${course._id}`);
   
  };
  return (
    <>
      <div className="course-list">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} onReadMoreClick={handleReadMore} enrolled={false}/>
        ))}
      </div>
    </>
  );
};

export default CourseList;
