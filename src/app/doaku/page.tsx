"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, Heart, CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import PrayerCard from "@/components/PrayerCard";
import StreakDisplay from "@/components/StreakDisplay";
import AnsweredModal from "@/components/AnsweredModal";
import UpdateModal from "@/components/UpdateModal";
import ShareToast from "@/components/ShareToast";
import SkeletonCard from "@/components/SkeletonCard";
import { PrayerData, fetchPrayers, fetchStats, prayForRequest, markAnswered, addPrayerUpdate, deletePrayerRequest } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";

export default function MyPrayersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"mine" | "answered">("mine");
  const [prayers, setPrayers] = useState<PrayerData[]>([]);
  const [userStats, setUserStats] = useState({ currentStreak: 0, longestStreak: 0, totalPrayed: 0, prayersSubmitted: 0, prayersAnswered: 0 });
  const [loading, setLoading] = useState(true);
  const [showAnswered, setShowAnswered] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (msg: string) => { setToast({ message: msg, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/masuk");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const [p, s] = await Promise.all([
          fetchPrayers({ tab: tab === "answered" ? "dijawab" : "permohonan" }),
          fetch("/api/user/stats").then(r => r.json()),
        ]);
        // Filter to only user's prayers (client-side for now)
        setPrayers(p);
        setUserStats(s);
      } finally { setLoading(false); }
    })();
  }, [session, tab]);

  const handlePray = async (id: string) => {
    const updated = await prayForRequest(id);
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, prayerCount: updated.prayerCount } : p));
  };

  const handleShare = async (prayer: PrayerData) => {
    const url = `${window.location.origin}/doa/${prayer.id}`;
    if (navigator.share) { try { await navigator.share({ title: "Permohonan Doa", url }); } catch {} }
    else { await navigator.clipboard.writeText(url); showToast("Link disalin!"); }
  };

  if (status === "loading") return <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center"><div className="skeleton h-8 w-32" /></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-stone-200/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg p-2 hover:bg-stone-100 transition-colors"><ArrowLeft className="h-5 w-5 text-stone-600" /></Link>
          <h1 className="font-serif text-lg text-stone-900">Doa Saya</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        {/* Streak & Stats */}
        <StreakDisplay currentStreak={userStats.currentStreak} longestStreak={userStats.longestStreak} totalPrayed={userStats.totalPrayed} />

        <div className="mt-4 flex gap-3">
          {[
            { icon: FileText, label: "Diajukan", value: userStats.prayersSubmitted, color: "text-amber-600" },
            { icon: Heart, label: "Didoakan", value: userStats.totalPrayed, color: "text-rose-500" },
            { icon: CheckCircle2, label: "Dijawab", value: userStats.prayersAnswered, color: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-stone-100">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <div>
                <p className="text-base font-bold text-stone-900">{s.value}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-xl bg-stone-100/80 p-1">
          {[
            { key: "mine" as const, label: "Permohonan Saya" },
            { key: "answered" as const, label: "Dijawab" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${tab === t.key ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
            >{t.label}</button>
          ))}
        </div>

        {/* Prayer list */}
        <div className="mt-5 space-y-4">
          {loading ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />) :
            prayers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">{tab === "answered" ? "✨" : "🙏"}</p>
                <p className="font-serif text-lg text-stone-700">{tab === "answered" ? "Belum ada doa yang dijawab" : "Belum ada permohonan doa"}</p>
                <p className="text-sm text-stone-400 mt-1">{tab === "answered" ? "Terus berdoa dan percaya!" : "Tulis permohonan doamu yang pertama"}</p>
              </div>
            ) : prayers.map((prayer, i) => (
              <PrayerCard key={prayer.id} prayer={prayer} index={i}
                onPray={handlePray} onShare={handleShare}
                onMarkAnswered={(id) => { setSelectedId(id); setShowAnswered(true); }}
                onDelete={async (id) => { await deletePrayerRequest(id); setPrayers(p => p.filter(x => x.id !== id)); showToast("Dihapus"); }}
                onAddUpdate={(id) => { setSelectedId(id); setShowUpdate(true); }}
              />
            ))
          }
        </div>
      </main>

      <AnsweredModal isOpen={showAnswered} onClose={() => { setShowAnswered(false); setSelectedId(null); }}
        onSubmit={async (testimony) => { if (selectedId) { await markAnswered(selectedId, testimony); setShowAnswered(false); showToast("Puji Tuhan!"); } }} />
      <UpdateModal isOpen={showUpdate} onClose={() => { setShowUpdate(false); setSelectedId(null); }}
        onSubmit={async (content) => { if (selectedId) { await addPrayerUpdate(selectedId, content); setShowUpdate(false); showToast("Update ditambahkan"); } }} />
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
