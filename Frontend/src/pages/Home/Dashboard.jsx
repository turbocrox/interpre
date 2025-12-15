/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuPlus, LuSparkles, LuLayoutGrid } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import CreateSessionForm from "../Home/CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Modal from "../../components/Modal";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-24 px-4 md:px-0">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <LuLayoutGrid className="w-5 h-5 text-black" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Sessions</h2>
              <p className="text-sm text-neutral-400">
                {sessions?.length || 0} interview sessions
              </p>
            </div>
          </div>

          <motion.button
            className="hidden md:flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
            onClick={() => setOpenCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LuPlus className="w-4 h-4" />
            New Session
          </motion.button>
        </motion.div>

        {sessions?.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 border border-neutral-800"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <LuSparkles className="w-10 h-10 text-neutral-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No sessions yet
            </h3>
            <p className="text-neutral-500 text-center max-w-md mb-6">
              Create your first interview prep session to get started with
              AI-powered questions.
            </p>
            <motion.button
              className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors"
              onClick={() => setOpenCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LuPlus className="w-4 h-4" />
              Create First Session
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="popLayout">
              {sessions?.map((data, index) => (
                <motion.div
                  key={data?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <SummaryCard
                    colors={CARD_BG[index % CARD_BG.length]}
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || "-"}
                    questions={data?.questions?.length || "-"}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                    }
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.button
          className="md:hidden h-14 w-14 flex items-center justify-center bg-white text-black rounded-2xl shadow-lg shadow-white/10 fixed bottom-6 right-6"
          onClick={() => setOpenCreateModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <LuPlus className="text-2xl" />
        </motion.button>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <CreateSessionForm />
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Session"
      >
        <DeleteAlertContent
          content="Are you sure you want to delete this session? This action cannot be undone."
          onDelete={() => deleteSession(openDeleteAlert.data)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
