import React from "react";
import Instructors from "../components/HomeComponents/Instructors";
import { useTitle } from "../Hooks/title-hook";
import AboutHeader from "../components/AboutComponents/AboutHeader";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const About = () => {
  useTitle("About Us");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <AboutHeader/>
      <Instructors />
    </motion.div>
  );
};

export default About;
