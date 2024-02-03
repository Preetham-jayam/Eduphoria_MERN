import React from 'react'
import TSignup from '../components/SignUp/Tsignup'
import {motion} from "framer-motion"
import { useTitle } from "../Hooks/title-hook";
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const TeacherSignup = () => {
    useTitle("Teacher SignUp");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
        <TSignup/>
    </motion.div>
  )
}

export default TeacherSignup