"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send } from "lucide-react";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export default function UpdateModal({ isOpen, onClose, onSubmit }: UpdateModalProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl sm:m-4"
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700 sm:hidden" />
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tambah Update</h2>
                  <p className="text-xs text-slate-400">Bagikan perkembangan permohonan doamu</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <textarea
                placeholder="Contoh: Kondisi ibu saya sudah mulai membaik, terima kasih atas doa saudara/i sekalian..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200 outline-none transition-colors focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400 resize-none"
                required
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!content.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Kirim Update
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
