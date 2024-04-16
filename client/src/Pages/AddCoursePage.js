import React from "react";
import { useTitle } from "../Hooks/title-hook";
import AddCourse from "../components/TeacherHomeComponents/AddCourse";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const AddCoursePage = () => {
  useTitle("Add Course");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <AddCourse/>
    </motion.div>
  );
};

export default AddCoursePage;
