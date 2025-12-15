import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { LuLogOut, LuChevronDown } from "react-icons/lu";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div className="relative">
        <motion.div
          className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img
            src={user.profileImageUrl}
            alt=""
            className="w-10 h-10 bg-neutral-700 rounded-xl object-cover border-2 border-neutral-700"
            whileHover={{ borderColor: "rgba(255,255,255,0.3)" }}
          />

          <div className="hidden md:block">
            <div className="text-sm text-white font-semibold leading-tight">
              {user.name || ""}
            </div>
            <div className="text-xs text-neutral-500">View profile</div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <LuChevronDown className="w-4 h-4 text-neutral-500" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/30 overflow-hidden z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-3 border-b border-neutral-800">
                  <div className="text-sm text-white font-semibold">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {user.email}
                  </div>
                </div>

                <motion.button
                  className="w-full flex items-center gap-2 px-3 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  onClick={handleLogout}
                  whileHover={{ x: 4 }}
                >
                  <LuLogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  );
};

export default ProfileInfoCard;
