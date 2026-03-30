"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          preferredCategories: selectedCategories,
          location: location.trim(),
        }),
      });
      onClose();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 shadow-xl ring-1 ring-stone-100 dark:ring-stone-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="font-serif text-lg text-stone-900 dark:text-stone-100">Selamat Datang</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1.5 px-5 pt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-amber-500" : "bg-stone-200 dark:bg-stone-700"
                  }`}
                />
              ))}
            </div>

            {/* Steps */}
            <div className="relative h-80 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-5"
                  >
                    <div className="flex flex-col items-center text-center pt-4">
                      <div className="mb-4 text-5xl">🙏</div>
                      <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                        Halo, saudaraku!
                      </h3>
                      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                        Mari berkenalan. Siapa nama yang ingin kamu tampilkan di komunitas doa ini?
                      </p>
                      <input
                        type="text"
                        placeholder="Nama kamu..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-6 w-full rounded-xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-center text-sm text-stone-800 dark:text-stone-200 outline-none transition-all focus:border-amber-400 dark:focus:border-amber-500 placeholder:text-stone-400"
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-5"
                  >
                    <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 text-center">
                      Kategori doa yang diminati
                    </h3>
                    <p className="mt-1 text-xs text-stone-400 text-center mb-4">
                      Pilih satu atau lebih untuk personalisasi pengalamanmu
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => toggleCategory(cat.value)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ring-1 ${
                            selectedCategories.includes(cat.value)
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 ring-amber-300 dark:ring-amber-700"
                              : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 ring-stone-200 dark:ring-stone-700 hover:ring-stone-300"
                          }`}
                        >
                          <span>{cat.emoji}</span>
                          <span className="truncate">{cat.label}</span>
                          {selectedCategories.includes(cat.value) && (
                            <Check className="h-3.5 w-3.5 ml-auto shrink-0 text-amber-600 dark:text-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-5"
                  >
                    <div className="flex flex-col items-center text-center pt-4">
                      <div className="mb-4 text-5xl">📍</div>
                      <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                        Dari mana asalmu?
                      </h3>
                      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                        Opsional. Ini membantu kami menghubungkanmu dengan komunitas doa terdekat.
                      </p>
                      <input
                        type="text"
                        placeholder="Contoh: Jakarta, Surabaya..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-6 w-full rounded-xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3 text-center text-sm text-stone-800 dark:text-stone-200 outline-none transition-all focus:border-amber-400 dark:focus:border-amber-500 placeholder:text-stone-400"
                      />
                      <p className="mt-2 text-xs text-stone-400">
                        Kamu bisa melewati langkah ini
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 px-5 py-4">
              {step > 1 ? (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={goNext}
                  disabled={step === 1 && !name.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-stone-900 disabled:opacity-40 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-amber-700 transition-colors"
                >
                  {submitting ? "Menyimpan..." : "Mulai Berdoa"}
                  <Sparkles className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
