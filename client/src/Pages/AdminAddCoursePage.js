import React from 'react';
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import AdminAddCourse from '../components/AdminDashboard/AdminAddCourse';
import GoBackButton from '../shared/components/FrontendTools/GoBack';
const AdminAddCoursePage = () => {
  useTitle("Admin Add Course Page");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <AdminAddCourse/>
    </motion.div>
  )
}

export default AdminAddCoursePage;