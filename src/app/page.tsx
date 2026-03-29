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
  const [loading, setLoading] = useState(true);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prayersData, statsData] = await Promise.all([
        fetchPrayers({ tab: activeTab, category: filterCategory, search: searchQuery }),
        fetchStats(),
      ]);
      setPrayers(prayersData);
      setStats(statsData);
    } finally {
      setLoading(false);
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
    const text = `🙏 Permohonan Doa\n\nDari: ${prayer.isAnonymous ? "Hamba Tuhan" : prayer.name}\nKategori: ${CATEGORIES.find((c) => c.value === prayer.category)?.label || prayer.category}\n\n"${prayer.content}"\n\n${prayer.scriptureVerse ? `📖 ${prayer.scriptureVerse}\n\n` : ""}Mari mendoakan bersama di PermohonanDoa.com`;

    if (navigator.share) {
      try { await navigator.share({ title: "Permohonan Doa", text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Berhasil disalin ke clipboard!");
    }
  };

  // Random daily verse
  const dailyVerse = SCRIPTURE_SUGGESTIONS[new Date().getDay() % SCRIPTURE_SUGGESTIONS.length];

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewPrayer={() => setShowNewModal(true)}
        stats={stats}
      />

      <main className="mx-auto max-w-2xl px-4 py-5">
        {/* Search & Filter */}
        <div className="mb-5 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari permohonan doa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border-2 border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-400 placeholder:text-stone-400"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-all ${
                showFilters || filterCategory !== "semua"
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
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
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-300"
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
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-300"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Prayer list */}
        {loading ? (
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
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-5 ring-1 ring-amber-100/60">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Ayat Hari Ini</span>
            </div>
            <p className="font-serif text-base italic text-stone-700 leading-relaxed">
              &ldquo;{dailyVerse.text}&rdquo;
            </p>
            <p className="mt-2 text-xs font-bold text-amber-700">— {dailyVerse.verse}</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white/50 py-8 text-center">
        <p className="font-serif text-base text-stone-600">PermohonanDoa.com</p>
        <p className="mt-1 text-xs text-stone-400">
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
