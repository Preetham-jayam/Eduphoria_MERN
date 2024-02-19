import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import CourseDetails from '../components/CourseDetails/CourseDetails';
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const CourseDetailsPage = () => {
  useTitle("Course Details Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
        <CourseDetails/>
    </motion.div>
  )
}

export default CourseDetailsPage;