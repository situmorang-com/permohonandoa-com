"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { X, AlertTriangle, Send, LogIn } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerRequestId?: string;
  commentId?: string;
}

const REPORT_REASONS = [
  { value: "inappropriate", label: "Konten tidak pantas" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Pelecehan" },
  { value: "other", label: "Lainnya" },
];

export default function ReportModal({ isOpen, onClose, prayerRequestId, commentId }: ReportModalProps) {
  const { data: session } = useSession();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason || submitting) return;

    setSubmitting(true);
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          notes: notes.trim(),
          prayerRequestId,
          commentId,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason("");
        setNotes("");
      }, 2000);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-100 dark:ring-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h2 className="font-serif text-lg text-slate-900 dark:text-slate-100">Laporkan Konten</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {!session?.user ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <LogIn className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Silakan{" "}
                    <a href="/masuk" className="font-semibold text-indigo-700 dark:text-indigo-400 hover:underline">
                      masuk
                    </a>{" "}
                    untuk melaporkan konten.
                  </p>
                </div>
              ) : submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <AlertTriangle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Laporan terkirim</p>
                  <p className="text-xs text-slate-400 text-center">
                    Terima kasih. Tim kami akan meninjau laporan Anda.
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Pilih alasan pelaporan:
                  </p>

                  <div className="space-y-2">
                    {REPORT_REASONS.map((r) => (
                      <label
                        key={r.value}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all ring-1 ${
                          reason === r.value
                            ? "bg-indigo-50 dark:bg-indigo-900/20 ring-indigo-300 dark:ring-indigo-700"
                            : "bg-white dark:bg-slate-800 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="report-reason"
                          value={r.value}
                          checked={reason === r.value}
                          onChange={() => setReason(r.value)}
                          className="accent-indigo-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{r.label}</span>
                      </label>
                    ))}
                  </div>

                  <textarea
                    placeholder="Catatan tambahan (opsional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-4 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 placeholder:text-slate-400 resize-none"
                  />

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!reason || submitting}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-red-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Mengirim..." : "Kirim Laporan"}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
