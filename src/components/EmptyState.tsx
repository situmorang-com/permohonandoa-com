"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  type: "semua" | "permohonan" | "dijawab";
  onNewPrayer: () => void;
}

const messages = {
  semua: {
    title: "Belum Ada Permohonan Doa",
    subtitle: "Jadilah yang pertama membagikan permohonan doamu kepada komunitas",
    emoji: "🙏",
  },
  permohonan: {
    title: "Semua Doa Telah Dijawab!",
    subtitle: "Puji Tuhan! Tidak ada permohonan yang sedang menunggu saat ini",
    emoji: "✨",
  },
  dijawab: {
    title: "Belum Ada Doa yang Dijawab",
    subtitle: "Terus berdoa dan percaya! Tuhan mendengar setiap doamu",
    emoji: "💛",
  },
};

export default function EmptyState({ type, onNewPrayer }: EmptyStateProps) {
  const msg = messages[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl mb-5"
      >
        {msg.emoji}
      </motion.div>
      <h3 className="font-serif text-xl text-slate-800 dark:text-slate-200">{msg.title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-xs">{msg.subtitle}</p>
      {type === "semua" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewPrayer}
          className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Tulis Permohonan Doa Pertama
        </motion.button>
      )}
    </motion.div>
  );
}
