import Login from "../components/Login/Login";
import { useTitle } from "../Hooks/title-hook";
import React from 'react'
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
const SignIn = () => {
  useTitle("SignIn page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <GoBackButton/>
    <Login/>
    </motion.div>
  )
}

export default SignIn