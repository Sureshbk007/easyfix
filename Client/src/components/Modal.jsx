import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

function Modal({ isModalOpen, setIsModalOpen, children }) {
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleClose = () => setIsModalOpen(false);

  return createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
          className="fixed inset-0 bg-gray-700 flex justify-center items-center bg-opacity-75 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "-40%" }}
            animate={{ y: 0 }}
            exit={{ y: "-40%" }}
            className="relative max-h-80 max-w-80 "
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;
