"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Heart } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalPrayed: number;
}

export default function StreakDisplay({ currentStreak, longestStreak, totalPrayed }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Current streak */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Flame className="h-6 w-6 text-orange-500" />
          {currentStreak > 0 && (
            <motion.div
              className="absolute -inset-1 rounded-full bg-orange-400/20"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <div>
          <motion.p
            key={currentStreak}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight"
          >
            {currentStreak}
          </motion.p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Hari berturut</p>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Longest streak */}
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{longestStreak}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Terpanjang</p>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Total prayed */}
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-rose-500" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{totalPrayed}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total doa</p>
        </div>
      </div>
    </div>
  );
}
