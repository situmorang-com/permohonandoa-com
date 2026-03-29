"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Eye, EyeOff, AlertTriangle, BookOpen, Shuffle } from "lucide-react";
import { PrayerCategory, CATEGORIES, SCRIPTURE_SUGGESTIONS } from "@/lib/types";

interface NewPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: PrayerCategory;
    content: string;
    isAnonymous: boolean;
    isUrgent: boolean;
    scriptureVerse?: string;
  }) => void;
}

export default function NewPrayerModal({ isOpen, onClose, onSubmit }: NewPrayerModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PrayerCategory>("lainnya");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [scriptureVerse, setScriptureVerse] = useState("");
  const [showScripture, setShowScripture] = useState(false);

  const randomVerse = () => {
    const verse = SCRIPTURE_SUGGESTIONS[Math.floor(Math.random() * SCRIPTURE_SUGGESTIONS.length)];
    setScriptureVerse(`"${verse.text}" — ${verse.verse}`);
    setShowScripture(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({
      name: isAnonymous ? "Hamba Tuhan" : name.trim() || "Hamba Tuhan",
      category,
      content: content.trim(),
      isAnonymous,
      isUrgent,
      scriptureVerse: scriptureVerse.trim() || undefined,
    });
    setName(""); setContent(""); setCategory("lainnya");
    setIsAnonymous(false); setIsUrgent(false);
    setScriptureVerse(""); setShowScripture(false);
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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl sm:m-4"
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 bg-white rounded-t-3xl sm:rounded-t-2xl">
              <div className="mx-auto mt-3 mb-0 h-1 w-10 rounded-full bg-stone-200 sm:hidden" />
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="font-serif text-xl text-stone-900">Tulis Permohonan Doa</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Bagikan pergumulanmu kepada sesama</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 hover:bg-stone-50 transition-colors">
                  <X className="h-5 w-5 text-stone-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Toggle row */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 transition-all ${
                    isAnonymous
                      ? "border-amber-300 bg-amber-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {isAnonymous ? <EyeOff className="h-4 w-4 text-amber-600" /> : <Eye className="h-4 w-4 text-stone-400" />}
                  <span className="text-sm font-medium">{isAnonymous ? "Anonim" : "Dengan Nama"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-all ${
                    isUrgent
                      ? "border-orange-300 bg-orange-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <AlertTriangle className={`h-4 w-4 ${isUrgent ? "text-orange-600" : "text-stone-400"}`} />
                  <span className="text-sm font-medium">Mendesak</span>
                </button>
              </div>

              {/* Name */}
              <AnimatePresence>
                {!isAnonymous && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Nama kamu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400 focus:bg-white placeholder:text-stone-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category */}
              <div>
                <p className="mb-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">Kategori</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        category === cat.value
                          ? "bg-stone-900 text-white shadow-sm"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <textarea
                  placeholder="Tuliskan permohonan doamu di sini...&#10;&#10;Contoh: Mohon doakan kesembuhan ibu saya yang sedang dirawat di rumah sakit..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-amber-400 focus:bg-white placeholder:text-stone-400 resize-none"
                  required
                />
                <p className="mt-1 text-right text-[10px] text-stone-400">
                  {content.length} karakter
                </p>
              </div>

              {/* Scripture */}
              <div>
                <button
                  type="button"
                  onClick={() => showScripture ? setShowScripture(false) : randomVerse()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  {showScripture ? "Sembunyikan ayat" : "Tambahkan ayat Alkitab"}
                </button>
                <AnimatePresence>
                  {showScripture && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 flex gap-2">
                        <textarea
                          placeholder="Ketik ayat atau klik acak..."
                          value={scriptureVerse}
                          onChange={(e) => setScriptureVerse(e.target.value)}
                          rows={2}
                          className="flex-1 rounded-xl border-2 border-amber-200 bg-amber-50/50 px-3 py-2 text-xs leading-relaxed outline-none focus:border-amber-400 placeholder:text-stone-400 resize-none"
                        />
                        <button
                          type="button"
                          onClick={randomVerse}
                          className="self-start rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200 transition-colors"
                          title="Ayat acak"
                        >
                          <Shuffle className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!content.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Kirim Permohonan Doa
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
