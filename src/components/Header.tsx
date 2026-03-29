"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Flame, Heart, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  activeTab: "semua" | "permohonan" | "dijawab";
  onTabChange: (tab: "semua" | "permohonan" | "dijawab") => void;
  onNewPrayer: () => void;
  stats: { total: number; answered: number; prayerCount: number };
}

export default function Header({ activeTab, onTabChange, onNewPrayer, stats }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-stone-200/60">
      <div className="mx-auto max-w-2xl px-4">
        {/* Top row */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md shadow-amber-600/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-stone-900">PermohonanDoa</h1>
              <p className="text-[11px] text-stone-400 tracking-wide">Berdoa bersama, berkat berlimpah</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewPrayer}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition-colors hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tulis Doa</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 pb-4">
          {[
            { icon: Flame, label: "Permohonan", value: stats.total, color: "text-amber-600" },
            { icon: Heart, label: "Doa Dinaikkan", value: stats.prayerCount, color: "text-rose-500" },
            { icon: CheckCircle2, label: "Dijawab", value: stats.answered, color: "text-emerald-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-1 items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 shadow-sm ring-1 ring-stone-100"
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <div>
                <p className="text-base font-bold text-stone-900 leading-tight">{stat.value.toLocaleString("id-ID")}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-stone-100/80 p-1 mb-0 -mx-0">
          {[
            { key: "semua" as const, label: "Semua Doa" },
            { key: "permohonan" as const, label: "Permohonan" },
            { key: "dijawab" as const, label: "Dijawab" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`relative flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
              {tab.key === "dijawab" && stats.answered > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700">
                  {stats.answered}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
