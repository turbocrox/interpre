import React from "react";
import { motion } from "framer-motion";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

const Navbar = () => {
  return (
    <motion.div
      className="h-16 bg-black/80 border-b border-neutral-800 backdrop-blur-xl py-2.5 px-4 md:px-0 sticky top-0 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto flex items-center justify-between gap-5">
        <Link to="/dashboard">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-9 h-9 bg-white rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
            >
              <LuSparkles className="w-4 h-4 text-black" />
            </motion.div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-5">
              Interview Prep AI
            </h2>
          </motion.div>
        </Link>

        <ProfileInfoCard />
      </div>
    </motion.div>
  );
};

export default Navbar;
