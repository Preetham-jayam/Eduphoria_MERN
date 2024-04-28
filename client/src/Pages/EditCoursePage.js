import React from "react";
import { useTitle } from "../Hooks/title-hook";
import EditCourse from "../components/TeacherHomeComponents/EditCourse";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const EditCoursePage = () => {
  useTitle("Edit Course");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <EditCourse/>
    </motion.div>
  );
};

export default EditCoursePage;
