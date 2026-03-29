"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ShareToastProps {
  message: string;
  isVisible: boolean;
}

export default function ShareToast({ message, isVisible }: ShareToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-2.5 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-stone-900/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
