"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Flame, Heart, CheckCircle2, LogIn, LogOut, User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import DarkModeToggle from "./DarkModeToggle";

interface HeaderProps {
  activeTab: "semua" | "permohonan" | "dijawab";
  onTabChange: (tab: "semua" | "permohonan" | "dijawab") => void;
  onNewPrayer: () => void;
  stats: { total: number; answered: number; prayerCount: number };
}

export default function Header({ activeTab, onTabChange, onNewPrayer, stats }: HeaderProps) {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 shadow-sm dark:shadow-slate-900/50">
      <div className="mx-auto max-w-3xl px-4">
        {/* Top row */}
        <div className="flex items-center justify-between md:justify-end py-4">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-slate-900 dark:text-white">permohonandoa.com</h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 tracking-wide">Berdoa bersama</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* Auth button */}
            {status === "loading" ? (
              <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-300 dark:hover:ring-indigo-500 transition-all"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ""}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-white dark:bg-slate-800 p-2 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-indigo-300 dark:hover:ring-indigo-500 transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewPrayer}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tulis Doa</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 pb-4">
          {[
            { icon: Flame, label: "Permohonan", value: stats.total, gradient: "from-orange-500 to-amber-500", bg: "bg-orange-50 dark:bg-orange-950/30", ring: "ring-orange-200/60 dark:ring-orange-800/40", textColor: "text-orange-600 dark:text-orange-400" },
            { icon: Heart, label: "Doa Dinaikkan", value: stats.prayerCount, gradient: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-950/30", ring: "ring-rose-200/60 dark:ring-rose-800/40", textColor: "text-rose-600 dark:text-rose-400" },
            { icon: CheckCircle2, label: "Dijawab", value: stats.answered, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", ring: "ring-emerald-200/60 dark:ring-emerald-800/40", textColor: "text-emerald-600 dark:text-emerald-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`flex flex-1 items-center gap-2.5 rounded-xl ${stat.bg} px-3 py-2.5 shadow-sm ring-1 ${stat.ring}`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-sm`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{stat.value.toLocaleString("id-ID")}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
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
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
              {tab.key === "dijawab" && stats.answered > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
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
