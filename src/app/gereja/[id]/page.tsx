"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Users, Copy, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ShareToast from "@/components/ShareToast";

interface ChurchDetail {
  id: string; name: string; description: string | null; address: string | null;
  city: string | null; memberCount: number; inviteCode: string | null;
  members: { userId: string; role: string; userName: string | null; userImage: string | null }[];
}

export default function ChurchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [church, setChurch] = useState<ChurchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => { fetch(`/api/churches/${id}`).then(r => r.json()).then(d => { setChurch(d); setLoading(false); }); }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="skeleton h-8 w-40" /></div>;
  if (!church) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><p className="text-slate-400">Gereja tidak ditemukan</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/gereja" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" /></Link>
          <h1 className="font-serif text-lg text-slate-900 dark:text-slate-100 truncate">{church.name}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-5 space-y-5">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <h2 className="font-serif text-xl text-slate-900 dark:text-slate-100">{church.name}</h2>
          {church.description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{church.description}</p>}
          {(church.address || church.city) && (
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" />{[church.address, church.city].filter(Boolean).join(", ")}</p>
          )}
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-400"><Users className="h-3 w-3" /> {church.memberCount} anggota</p>
          {church.inviteCode && (
            <button onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/gereja/join/${church.inviteCode}`); showToast("Link undangan disalin!"); }}
              className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Copy className="h-3.5 w-3.5" /> Salin link undangan
            </button>
          )}
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Anggota ({church.members.length})</h3>
          <div className="space-y-2">
            {church.members.map(m => (
              <div key={m.userId} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  {m.userImage ? <Image src={m.userImage} alt="" width={32} height={32} className="h-full w-full object-cover" /> :
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{(m.userName || "?")[0].toUpperCase()}</span>}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{m.userName || "Pengguna"}</span>
                {m.role === "admin" && <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">Admin</span>}
              </div>
            ))}
          </div>
        </div>
      </main>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
