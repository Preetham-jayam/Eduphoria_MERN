import React from "react";
import CourseUpload from "../components/CourseUpload/CourseUpload";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const CourseUploadPage = () => {
  useTitle("CourseUpload");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <CourseUpload/>
    </motion.div>
  );
};

export default CourseUploadPage;
