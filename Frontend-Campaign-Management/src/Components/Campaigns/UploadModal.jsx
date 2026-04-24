import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  handleFileChange,
  handleDrop,
  selectedFiles,
  removeFile,
}) => {
  const fileInputRef = useRef();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background blur */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-2xl rounded-lg w-full max-w-xl px-6 py-6 border border-gray-300"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Upload Files</h2>

            {/* Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-400 p-6 text-center rounded-md bg-gray-50 mb-4 cursor-pointer hover:bg-gray-100"
            >
              <p className="text-gray-600">
                Drag & drop files here or click to select
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded shadow-sm"
                  >
                    <span className="truncate text-sm text-green-700">
                      ✅ {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700 text-lg ml-2"
                      title="Remove file"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-red-500 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onUpload}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
