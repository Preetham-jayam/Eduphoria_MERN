import React from "react";
import StudentQuiz from "../components/Quiz/StudentQuiz";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const About = () => {
  useTitle("Student Quiz Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
        <StudentQuiz/>
    </motion.div>
  );
};

export default About;
