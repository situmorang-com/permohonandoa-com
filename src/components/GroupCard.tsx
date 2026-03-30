"use client";

import { motion } from "framer-motion";
import { Users, Lock, Globe, ArrowRight } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  isPublic: boolean;
  imageUrl?: string;
}

interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
}

export default function GroupCard({ group, onJoin }: GroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Header accent */}
      <div className="h-2 bg-gradient-to-r from-indigo-400 to-blue-400" />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-lg text-slate-900 dark:text-slate-100 truncate">
                {group.name}
              </h3>
              {group.isPublic ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-700/50 shrink-0">
                  <Globe className="h-2.5 w-2.5" />
                  Publik
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shrink-0">
                  <Lock className="h-2.5 w-2.5" />
                  Privat
                </span>
              )}
            </div>
            {group.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {group.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            <span>{group.memberCount} anggota</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onJoin(group.id)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Gabung
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
