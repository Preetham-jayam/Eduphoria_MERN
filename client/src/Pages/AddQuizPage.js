import React from "react";
import AddQuiz from "../components/Quiz/AddQuiz";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const About = () => {
  useTitle("Add Quiz Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
        <AddQuiz/>
    </motion.div>
  );
};

export default About;
