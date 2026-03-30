"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import ChallengeCard from "@/components/ChallengeCard";
import ShareToast from "@/components/ShareToast";

interface Challenge {
  id: string; title: string; description: string; startDate: string; endDate: string;
  goalType: string; goalTarget: number; participantCount: number; isActive: boolean;
}

export default function ChallengesPage() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => {
    fetch("/api/challenges").then(r => r.json()).then(d => { setChallenges(d); setLoading(false); });
  }, []);

  const handleJoin = async (id: string) => {
    await fetch(`/api/challenges/${id}/join`, { method: "POST" });
    setJoinedIds(prev => new Set([...prev, id]));
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, participantCount: c.participantCount + 1 } : c));
    showToast("Berhasil ikut tantangan!");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-stone-200/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg p-2 hover:bg-stone-100"><ArrowLeft className="h-5 w-5 text-stone-600" /></Link>
          <h1 className="font-serif text-lg text-stone-900">Tantangan Doa</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-100/60">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <h2 className="font-serif text-lg text-stone-900">Tantangan Doa</h2>
          </div>
          <p className="text-sm text-stone-500">Ikuti tantangan doa bersama komunitas. Berdoa konsisten, bertumbuh bersama!</p>
        </div>

        {loading ? <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div> :
          challenges.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="mx-auto h-10 w-10 text-stone-300 mb-3" />
              <p className="font-serif text-lg text-stone-700">Belum ada tantangan</p>
              <p className="text-sm text-stone-400 mt-1">Tantangan doa baru akan segera hadir!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} isJoined={joinedIds.has(c.id)} progress={0} onJoin={() => handleJoin(c.id)} />
              ))}
            </div>
          )
        }
      </main>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
