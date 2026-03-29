"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, PartyPopper } from "lucide-react";

interface AnsweredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimony: string) => void;
}

export default function AnsweredModal({ isOpen, onClose, onSubmit }: AnsweredModalProps) {
  const [testimony, setTestimony] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(testimony.trim());
    setTestimony("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl sm:m-4"
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-stone-200 sm:hidden" />

            {/* Celebration header */}
            <div className="px-6 pt-5 pb-4 text-center border-b border-stone-100">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.1 }}
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200"
              >
                <PartyPopper className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <h2 className="font-serif text-2xl text-stone-900">Puji Tuhan!</h2>
              <p className="text-sm text-stone-400 mt-1">Doamu telah dijawab. Bagikan kesaksianmu!</p>
              <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-2 hover:bg-stone-50 transition-colors">
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <textarea
                placeholder="Ceritakan bagaimana Tuhan menjawab doamu... (opsional, namun kesaksianmu bisa menguatkan iman saudara/i lainnya)"
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-emerald-400 focus:bg-white placeholder:text-stone-400 resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-emerald-800"
              >
                <Sparkles className="h-4 w-4" />
                Tandai sebagai Dijawab
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
