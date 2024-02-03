import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import FAQ from '../components/HelpComponent/FAQ'
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const Help = () => {
  useTitle("Help Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <FAQ/>
    </motion.div>
  )
}

export default Help