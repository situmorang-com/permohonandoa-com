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
      className={`group rounded-2xl bg-white shadow-sm ring-1 transition-shadow duration-300 hover:shadow-md ${
        prayer.isAnswered
          ? "ring-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/30"
          : prayer.isUrgent
          ? "ring-amber-200/80"
          : "ring-stone-100"
      }`}
    >
      {/* Urgent banner */}
      {prayer.isUrgent && !prayer.isAnswered && (
        <div className="flex items-center gap-1.5 rounded-t-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 text-xs font-semibold text-amber-700 border-b border-amber-100">
          <AlertTriangle className="h-3 w-3 animate-urgent" />
          Permohonan Mendesak
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-stone-100 to-stone-200 text-sm font-bold text-stone-500">
              {(prayer.isAnonymous ? "H" : prayer.name[0] || "H").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                {prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${category?.color || "bg-stone-100 text-stone-600"}`}
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
              className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200/50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Dijawab!
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4">
          <p className={`text-[15px] leading-relaxed text-stone-700 whitespace-pre-wrap ${!expanded && isLong ? "line-clamp-4" : ""}`}>
            {prayer.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Lebih sedikit" : "Baca selengkapnya"}
            </button>
          )}
        </div>

        {/* Scripture verse */}
        {prayer.scriptureVerse && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50/60 px-3.5 py-2.5 ring-1 ring-amber-100/60">
            <BookOpen className="h-3.5 w-3.5 mt-0.5 text-amber-600 shrink-0" />
            <p className="text-xs italic text-amber-800 leading-relaxed">{prayer.scriptureVerse}</p>
          </div>
        )}

        {/* Answered Testimony */}
        {prayer.isAnswered && prayer.answeredTestimony && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 ring-1 ring-emerald-100/60"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <Star className="h-3 w-3 fill-emerald-500" />
              Kesaksian
            </div>
            <p className="text-sm text-emerald-900/80 leading-relaxed">{prayer.answeredTestimony}</p>
          </motion.div>
        )}

        {/* Prayer Updates */}
        {prayer.updates && prayer.updates.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Update Terbaru</p>
            {prayer.updates.slice(0, 2).map((update) => (
              <div key={update.id} className="rounded-lg bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
                <p className="text-xs text-stone-600">{update.content}</p>
                <p className="mt-1 text-[10px] text-stone-400">
                  {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true, locale: idLocale })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
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
                  className="flex items-center gap-2 text-amber-700"
                >
                  <Heart className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>Amin!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2 text-stone-600 hover:text-amber-700"
                >
                  <Heart className="h-4 w-4" />
                  <span>Doakan</span>
                </motion.div>
              )}
            </AnimatePresence>
            {prayer.prayerCount > 0 && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200/50">
                {prayer.prayerCount}
              </span>
            )}
            {isPraying && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-amber-100/50"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.button>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onAddUpdate(prayer.id)}
              className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
              title="Tambah update"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => onShare(prayer)}
              className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
              title="Bagikan"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowActions(!showActions)}
              className="rounded-lg p-2 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors text-base"
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
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors ring-1 ring-emerald-200/50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tandai Dijawab
                  </button>
                )}
                <button
                  onClick={() => { onDelete(prayer.id); setShowActions(false); }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors ring-1 ring-red-200/50"
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
