"use client";

import { motion } from "framer-motion";
import { Heart, Share2, ArrowLeft, BookOpen, CheckCircle2, Clock, Star } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, SCRIPTURE_SUGGESTIONS } from "@/lib/types";
import { prayForRequest, PrayerData } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";

interface Props {
  prayer: PrayerData;
}

export default function PrayerDetailClient({ prayer: initialPrayer }: Props) {
  const [prayer, setPrayer] = useState(initialPrayer);
  const [isPraying, setIsPraying] = useState(false);
  const category = CATEGORIES.find((c) => c.value === prayer.category);

  const handlePray = async () => {
    setIsPraying(true);
    const updated = await prayForRequest(prayer.id);
    setPrayer((prev) => ({ ...prev, prayerCount: updated.prayerCount }));
    setTimeout(() => setIsPraying(false), 1200);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/dialog/share?app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}&href=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = () => {
    const text = `🙏 Permohonan Doa dari ${prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}\n\n"${prayer.content.substring(0, 200)}${prayer.content.length > 200 ? "..." : ""}"\n\nMari mendoakan bersama: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = `🙏 Permohonan Doa: "${prayer.content.substring(0, 100)}..." — Mari mendoakan bersama`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  const timeAgo = formatDistanceToNow(new Date(prayer.createdAt), { addSuffix: true, locale: idLocale });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="font-serif text-lg text-slate-900 dark:text-white">Permohonan Doa</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ${
            prayer.isAnswered ? "ring-emerald-200/80 dark:ring-emerald-700/50" : "ring-slate-200/80 dark:ring-slate-700/80"
          }`}
        >
          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/60 dark:to-indigo-800/60 text-base font-bold text-indigo-600 dark:text-indigo-300">
              {(prayer.isAnonymous ? "H" : prayer.name[0] || "H").toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${category?.color}`}>
                  {category?.emoji} {category?.label}
                </span>
              </div>
            </div>
            {prayer.isAnswered && (
              <div className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-700/50">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dijawab!
              </div>
            )}
          </div>

          {/* Prayer content */}
          <p className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            {prayer.content}
          </p>

          {/* Scripture */}
          {prayer.scriptureVerse && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 px-4 py-3 ring-1 ring-indigo-100/60 dark:ring-indigo-800/40">
              <BookOpen className="h-4 w-4 mt-0.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <p className="text-sm italic text-indigo-800 dark:text-indigo-300 leading-relaxed">{prayer.scriptureVerse}</p>
            </div>
          )}

          {/* Testimony */}
          {prayer.isAnswered && prayer.answeredTestimony && (
            <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 ring-1 ring-emerald-100/60 dark:ring-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <Star className="h-3 w-3 fill-emerald-500" />
                Kesaksian
              </div>
              <p className="text-sm text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">{prayer.answeredTestimony}</p>
            </div>
          )}

          {/* Pray button */}
          <div className="mt-6 flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handlePray}
              disabled={isPraying}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                isPraying
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Heart className={`h-4 w-4 ${isPraying ? "fill-indigo-500 text-indigo-500" : ""}`} />
              {isPraying ? "Amin!" : "Doakan"}
            </motion.button>
            <span className="text-sm text-slate-400 dark:text-slate-500">
              {prayer.prayerCount} orang telah mendoakan
            </span>
          </div>
        </motion.div>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-700/80"
        >
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Share2 className="inline h-4 w-4 mr-1.5" />
            Bagikan permohonan doa ini
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#166FE5] active:scale-[0.98]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#20BD5A] active:scale-[0.98]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-slate-600 active:scale-[0.98]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X / Twitter
            </button>
            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-[0.98] ring-1 ring-slate-200 dark:ring-slate-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.122a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.04" />
              </svg>
              Salin Link
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            Bagikan agar lebih banyak orang mendoakan permohonan ini
          </p>
        </motion.div>
      </main>
    </div>
  );
}
