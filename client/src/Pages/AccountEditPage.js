import React from "react";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
import AccountEdit from "../components/Profile/AccountEdit";

const AccountEditPage = () => {
  useTitle("Account Edit");
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}>
      <GoBackButton/>
      <AccountEdit />
    </motion.div>
  );
};

export default AccountEditPage;
