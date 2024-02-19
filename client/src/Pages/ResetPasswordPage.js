import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import GoBackButton from '../shared/components/FrontendTools/GoBack';
import ResetPassword from '../components/Forgotpassword/ResetPassword';
const ResetPasswordPage = () => {
  useTitle("ResetPassword Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <ResetPassword/>
    </motion.div>
  )
}

export default ResetPasswordPage;