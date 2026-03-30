"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  CheckCircle2,
  Clock,
  Trash2,
  Star,
  AlertTriangle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { PrayerData } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface PrayerCardProps {
  prayer: PrayerData;
  onPray: (id: string) => void;
  onMarkAnswered: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (prayer: PrayerData) => void;
  onAddUpdate: (id: string) => void;
  index: number;
}

export default function PrayerCard({
  prayer,
  onPray,
  onMarkAnswered,
  onDelete,
  onShare,
  onAddUpdate,
  index,
}: PrayerCardProps) {
  const [isPraying, setIsPraying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const category = CATEGORIES.find((c) => c.value === prayer.category);
  const isLong = prayer.content.length > 200;

  const handlePray = () => {
    setIsPraying(true);
    onPray(prayer.id);
    setTimeout(() => setIsPraying(false), 1200);
  };

  const timeAgo = formatDistanceToNow(new Date(prayer.createdAt), {
    addSuffix: true,
    locale: idLocale,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`group rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 transition-shadow duration-300 hover:shadow-md ${
        prayer.isAnswered
          ? "ring-emerald-200/80 dark:ring-emerald-700/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-emerald-950/20"
          : prayer.isUrgent
          ? "ring-amber-200/80 dark:ring-amber-700/50"
          : "ring-slate-200/80 dark:ring-slate-700/80"
      }`}
    >
      {/* Urgent banner */}
      {prayer.isUrgent && !prayer.isAnswered && (
        <div className="flex items-center gap-1.5 rounded-t-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border-b border-amber-100 dark:border-amber-800/50">
          <AlertTriangle className="h-3 w-3 animate-urgent" />
          Permohonan Mendesak
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/60 dark:to-indigo-800/60 text-sm font-bold text-indigo-600 dark:text-indigo-300">
              {(prayer.isAnonymous ? "H" : prayer.name[0] || "H").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${category?.color || "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                >
                  {category?.emoji} {category?.label}
                </span>
              </div>
            </div>
          </div>

          {prayer.isAnswered && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-700/50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Dijawab!
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4">
          <p className={`text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap ${!expanded && isLong ? "line-clamp-4" : ""}`}>
            {prayer.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Lebih sedikit" : "Baca selengkapnya"}
            </button>
          )}
        </div>

        {/* Scripture verse */}
        {prayer.scriptureVerse && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 px-3.5 py-2.5 ring-1 ring-indigo-100/60 dark:ring-indigo-800/40">
            <BookOpen className="h-3.5 w-3.5 mt-0.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <p className="text-xs italic text-indigo-800 dark:text-indigo-300 leading-relaxed">{prayer.scriptureVerse}</p>
          </div>
        )}

        {/* Answered Testimony */}
        {prayer.isAnswered && prayer.answeredTestimony && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2.5 ring-1 ring-emerald-100/60 dark:ring-emerald-800/40"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              <Star className="h-3 w-3 fill-emerald-500" />
              Kesaksian
            </div>
            <p className="text-sm text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">{prayer.answeredTestimony}</p>
          </motion.div>
        )}

        {/* Prayer Updates */}
        {prayer.updates && prayer.updates.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Update Terbaru</p>
            {prayer.updates.slice(0, 2).map((update) => (
              <div key={update.id} className="rounded-lg bg-slate-50 dark:bg-slate-700/50 px-3 py-2 ring-1 ring-slate-100 dark:ring-slate-600/50">
                <p className="text-xs text-slate-600 dark:text-slate-300">{update.content}</p>
                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true, locale: idLocale })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
          {/* Pray button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePray}
            disabled={isPraying}
            className="relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
          >
            <AnimatePresence mode="wait">
              {isPraying ? (
                <motion.div
                  key="praying"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                >
                  <Heart className="h-4 w-4 fill-indigo-500 text-indigo-500" />
                  <span>Amin!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Heart className="h-4 w-4" />
                  <span>Doakan</span>
                </motion.div>
              )}
            </AnimatePresence>
            {prayer.prayerCount > 0 && (
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200/50 dark:ring-indigo-700/50">
                {prayer.prayerCount}
              </span>
            )}
            {isPraying && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/30"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.button>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onAddUpdate(prayer.id)}
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Tambah update"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => onShare(prayer)}
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Bagikan"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowActions(!showActions)}
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-base"
              title="Lainnya"
            >
              ···
            </button>
          </div>
        </div>

        {/* More actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 pt-2">
                {!prayer.isAnswered && (
                  <button
                    onClick={() => { onMarkAnswered(prayer.id); setShowActions(false); }}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors ring-1 ring-emerald-200/50 dark:ring-emerald-700/50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tandai Dijawab
                  </button>
                )}
                <button
                  onClick={() => { onDelete(prayer.id); setShowActions(false); }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors ring-1 ring-red-200/50 dark:ring-red-700/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
