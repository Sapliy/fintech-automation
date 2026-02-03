import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useToaster from "../store/toaster.store";
import { SelectorToaster } from "../store/type";
import { useShallow } from "zustand/shallow";

interface NotificationProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const selectorToaster: SelectorToaster = (state) => ({
  addToast: state.addToast,
  removeToast: state.removeToast,
});

const Toaster: React.FC<NotificationProps> = ({
  position = "top-right",
}) => {
  const { toasters, removeToast } = useToaster(useShallow(selectorToaster));

  useEffect(() => {
    toasters?.forEach((notification) => {
      const timer = setTimeout(() => {
        removeToast?.(notification.id);
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [toasters, removeToast]);

  const getPositionClass = () => {
    switch (position) {
      case "top-right":
        return "top-0 right-0";
      case "top-left":
        return "top-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      default:
        return "top-0 right-0";
    }
  };

  return (
    <div className={`fixed p-4 space-y-2 z-50 ${getPositionClass()}`}>
      <AnimatePresence>
        {toasters?.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded shadow-md text-white ${
              t.status === "success"
                ? "bg-green-500"
                : t.status === "error"
                ? "bg-red-500"
                : t.status === "info"
                ? "bg-blue-500"
                : "bg-yellow-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold">{t.title}</h4>
                <p>{t.description}</p>
              </div>
              <button
                onClick={() => removeToast?.(t.id)}
                className="ml-4"
              >
                &times;
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
