"use client";

import { motion } from "framer-motion";
import { Target, Users, Calendar, CheckCircle2 } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  goalType?: string;
  goalTarget?: number;
  isActive?: boolean;
  totalDays?: number;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  isJoined: boolean;
  progress: number; // 0-100
}

export default function ChallengeCard({ challenge, onJoin, isJoined, progress }: ChallengeCardProps) {
  const startDate = new Date(challenge.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const endDate = new Date(challenge.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40">
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg text-slate-900 dark:text-slate-100">{challenge.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {startDate} - {endDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {challenge.participantCount} peserta
          </span>
        </div>

        {/* Progress bar */}
        {isJoined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Progres</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-blue-400"
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          {isJoined ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-700/50">
              <CheckCircle2 className="h-4 w-4" />
              Sedang mengikuti
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onJoin(challenge.id)}
              className="w-full rounded-xl bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              Ikut Tantangan
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
