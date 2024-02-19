import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import ForgotPassword from '../components/Forgotpassword/ForgotPassword';
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const ForgotPasswordPage = () => {
  useTitle("ForgotPassword Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <ForgotPassword/>
    </motion.div>
  )
}

export default ForgotPasswordPage