import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function SupportModal({ isOpen, onClose, onSubmit, message, setMessage }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background blur with soft shadow */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal box */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top- left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-lg w-full max-w-md px-6 py-5 border border-gray-300 dark:border-gray-600"
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Support Request
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <textarea
                className="w-full h-28 p-3 border border-gray-300 rounded-md resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Describe your issue or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 mr-3"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SupportModal;
