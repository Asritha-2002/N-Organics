// components/LoginRequiredModal.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({
  isOpen,
  onClose,
  title = "Sign In Required",
  message = "Please sign in to continue.",
  redirectPath = "/sign-in",
}) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Content */}
            <div className="p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#457358]/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#457358]" />
              </div>

              <h2 className="text-xl font-bold text-[#143c2f]">
                {title}
              </h2>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onClose?.();
                  navigate(redirectPath);
                }}
                className="flex-1 py-3 rounded-xl bg-[#457358] text-white font-semibold hover:bg-[#143c2f] transition"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}