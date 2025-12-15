/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuBriefcase, LuMessageSquare, LuCalendar, LuSparkles, LuTarget, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const GlowOrb = ({ color, size, position, delay }) => (
  <motion.div
    className={`absolute ${size} ${color} rounded-full blur-[100px]`}
    style={position}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.15, 0.25, 0.15],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const AnimatedBadge = ({ children, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
    className="text-[11px] font-medium px-4 py-2 rounded-full border bg-white/5 text-white/80 border-white/10 backdrop-blur-sm"
    whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
  >
    <span className="flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  </motion.div>
);

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black border-b border-white/5"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <GlowOrb
          color="bg-white"
          size="w-64 h-64"
          position={{ top: "-20%", right: "10%" }}
          delay={0}
        />
        <GlowOrb
          color="bg-neutral-400"
          size="w-48 h-48"
          position={{ top: "20%", right: "30%" }}
          delay={0.5}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.03), transparent 40%)`,
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-6 md:px-6">
        <div className="min-h-[240px] flex flex-col justify-center relative z-10 py-8">
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-6 w-fit transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ x: -4 }}
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <motion.div
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 border border-white/10 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LuSparkles className="w-3 h-3" />
                </motion.span>
                AI Interview Session
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {role || (
                <span className="text-neutral-600">Loading...</span>
              )}
            </motion.h1>

            <motion.p
              className="text-base text-neutral-400 max-w-2xl flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <LuTarget className="w-4 h-4 text-neutral-500 flex-shrink-0" />
              {topicsToFocus || "General interview topics"}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AnimatedBadge icon={LuBriefcase} delay={0.35}>
                {experience} {experience == 1 ? "Year" : "Years"} Experience
              </AnimatedBadge>

              <AnimatedBadge icon={LuMessageSquare} delay={0.4}>
                {questions} Questions
              </AnimatedBadge>

              <AnimatedBadge icon={LuCalendar} delay={0.45}>
                Updated: {lastUpdated}
              </AnimatedBadge>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RoleInfoHeader;
