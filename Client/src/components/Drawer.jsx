import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function Drawer({
  isDrawerOpen,
  setIsDrawerOpen,
  position = "right",
  children,
}) {
  const positionClasses = {
    left: "left-0 top-0 bottom-0",
    right: "right-0 top-0 bottom-0",
  };

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleClose = () => setIsDrawerOpen(false);

  return createPortal(
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50"
          onClick={handleClose}
        >
          <motion.div
            key="drawer"
            initial={{ x: position == "left" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: position == "left" ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed p-10 ${positionClasses[position]} max-w-[75vw] md:max-w-[50vw]`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Drawer;
