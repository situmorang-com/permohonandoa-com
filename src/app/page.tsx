"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PrayerCard from "@/components/PrayerCard";
import NewPrayerModal from "@/components/NewPrayerModal";
import AnsweredModal from "@/components/AnsweredModal";
import UpdateModal from "@/components/UpdateModal";
import EmptyState from "@/components/EmptyState";
import ShareToast from "@/components/ShareToast";
import SkeletonCard from "@/components/SkeletonCard";
import { PrayerCategory, CATEGORIES, SCRIPTURE_SUGGESTIONS } from "@/lib/types";
import {
  PrayerData,
  fetchPrayers,
  fetchStats,
  createPrayer,
  prayForRequest,
  markAnswered,
  addPrayerUpdate,
  deletePrayerRequest,
} from "@/lib/api";
import { Search, Filter, BookOpen, X } from "lucide-react";

export default function Home() {
  const [prayers, setPrayers] = useState<PrayerData[]>([]);
  const [stats, setStats] = useState({ total: 0, answered: 0, prayerCount: 0 });
  const [activeTab, setActiveTab] = useState<"semua" | "permohonan" | "dijawab">("semua");
  const [showNewModal, setShowNewModal] = useState(false);
  const [showAnsweredModal, setShowAnsweredModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<PrayerCategory | "semua">("semua");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [initialLoad, setInitialLoad] = useState(true);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  };

  const loadData = useCallback(async () => {
    try {
      const [prayersData, statsData] = await Promise.all([
        fetchPrayers({ tab: activeTab, category: filterCategory, search: searchQuery }),
        fetchStats(),
      ]);
      setPrayers(prayersData);
      setStats(statsData);
    } finally {
      setInitialLoad(false);
    }
  }, [activeTab, filterCategory, searchQuery]);

  useEffect(() => { loadData(); }, [loadData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleNewPrayer = async (data: {
    name: string;
    category: PrayerCategory;
    content: string;
    isAnonymous: boolean;
    isUrgent: boolean;
    scriptureVerse?: string;
  }) => {
    await createPrayer(data);
    setShowNewModal(false);
    showToast("Permohonan doa berhasil dikirim!");
    loadData();
  };

  const handlePray = async (id: string) => {
    const updated = await prayForRequest(id);
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, prayerCount: updated.prayerCount } : p)));
    setStats((prev) => ({ ...prev, prayerCount: prev.prayerCount + 1 }));
  };

  const handleMarkAnswered = (id: string) => {
    setSelectedPrayerId(id);
    setShowAnsweredModal(true);
  };

  const handleAnsweredSubmit = async (testimony: string) => {
    if (selectedPrayerId) {
      await markAnswered(selectedPrayerId, testimony);
      setShowAnsweredModal(false);
      setSelectedPrayerId(null);
      showToast("Puji Tuhan! Doa telah dijawab!");
      loadData();
    }
  };

  const handleAddUpdate = (id: string) => {
    setSelectedPrayerId(id);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (content: string) => {
    if (selectedPrayerId) {
      await addPrayerUpdate(selectedPrayerId, content);
      setShowUpdateModal(false);
      setSelectedPrayerId(null);
      showToast("Update berhasil ditambahkan");
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    await deletePrayerRequest(id);
    showToast("Permohonan doa telah dihapus");
    loadData();
  };

  const handleShare = async (prayer: PrayerData) => {
    const url = `${window.location.origin}/doa/${prayer.id}`;
    const text = `🙏 Permohonan Doa dari ${prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}\n\n"${prayer.content.substring(0, 200)}${prayer.content.length > 200 ? "..." : ""}"\n\nMari mendoakan bersama:`;

    if (navigator.share) {
      try { await navigator.share({ title: "Permohonan Doa", text, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      showToast("Link berhasil disalin!");
    }
  };

  // Random daily verse
  const dailyVerse = SCRIPTURE_SUGGESTIONS[new Date().getDay() % SCRIPTURE_SUGGESTIONS.length];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewPrayer={() => setShowNewModal(true)}
        stats={stats}
      />

      <main className="mx-auto max-w-3xl px-4 py-5">
        {/* Search & Filter */}
        <div className="mb-5 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Cari permohonan doa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all focus:border-indigo-400 dark:focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-all ${
                showFilters || filterCategory !== "semua"
                  ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "border-slate-200 dark:border-slate-700 bg-white text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Filter className="h-4 w-4" />
              {filterCategory !== "semua" && (
                <span className="text-xs">{CATEGORIES.find((c) => c.value === filterCategory)?.emoji}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="flex flex-wrap gap-1.5 overflow-hidden"
            >
              <button
                onClick={() => setFilterCategory("semua")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  filterCategory === "semua"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600"
                }`}
              >
                Semua
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    filterCategory === cat.value
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Prayer list */}
        {initialLoad ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : prayers.length === 0 ? (
          <EmptyState type={activeTab} onNewPrayer={() => setShowNewModal(true)} />
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer, index) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onPray={handlePray}
                onMarkAnswered={handleMarkAnswered}
                onDelete={handleDelete}
                onShare={handleShare}
                onAddUpdate={handleAddUpdate}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Daily verse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 mb-8"
        >
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 px-6 py-5 ring-1 ring-indigo-100/60 dark:ring-indigo-800/40">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Ayat Hari Ini</span>
            </div>
            <p className="font-serif text-base italic text-slate-700 dark:text-slate-300 leading-relaxed">
              &ldquo;{dailyVerse.text}&rdquo;
            </p>
            <p className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">— {dailyVerse.verse}</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 py-8 text-center">
        <p className="font-serif text-base text-slate-600 dark:text-slate-300">PermohonanDoa.com</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Berdoa bersama, berkat berlimpah — Dibuat untuk komunitas Kristen Indonesia
        </p>
      </footer>

      {/* Modals */}
      <NewPrayerModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} onSubmit={handleNewPrayer} />
      <AnsweredModal
        isOpen={showAnsweredModal}
        onClose={() => { setShowAnsweredModal(false); setSelectedPrayerId(null); }}
        onSubmit={handleAnsweredSubmit}
      />
      <UpdateModal
        isOpen={showUpdateModal}
        onClose={() => { setShowUpdateModal(false); setSelectedPrayerId(null); }}
        onSubmit={handleUpdateSubmit}
      />
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
