import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import EmailSendingForm from '../components/AdminDashboard/EmailSending';
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const Help = () => {
  useTitle("Send Mail Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <EmailSendingForm/>
    </motion.div>
  )
}

export default Help