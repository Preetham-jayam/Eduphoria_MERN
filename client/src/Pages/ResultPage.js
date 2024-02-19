import React from "react";
import CourseList from "../components/Courses/CourseList";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const ResultsPage = () => {
  useTitle("Results Course");
  const location = useLocation();
  const { state } = location;
  const courses = state ? state.courses : [];
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <h1><span style={{textDecoration:'underline'}}>Results for query :</span> </h1>
      <h1>{state.query}</h1>
      <CourseList courses={courses} />
      {courses.length===0 && <h1>No Results found </h1>}
    </motion.div>
  );
};

export default ResultsPage;