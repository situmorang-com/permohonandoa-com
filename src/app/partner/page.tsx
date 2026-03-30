"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, UserPlus, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ShareToast from "@/components/ShareToast";

interface Partner { id: string; status: string; userId: string; partnerId: string; partnerName: string | null; partnerImage: string | null; }

export default function PartnersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => { if (status === "unauthenticated") router.push("/masuk"); }, [status, router]);

  const load = async () => { setLoading(true); const r = await fetch("/api/partners"); setPartners(await r.json()); setLoading(false); };
  useEffect(() => { if (session) load(); }, [session]);

  const handleMatch = async () => {
    setMatching(true);
    const res = await fetch("/api/partners", { method: "POST" });
    const data = await res.json();
    if (data.matched) showToast("Partner doa ditemukan!");
    else showToast("Mencari partner... Kamu akan dihubungkan segera!");
    load(); setMatching(false);
  };

  const handleRespond = async (id: string, action: "accept" | "decline") => {
    await fetch(`/api/partners/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    showToast(action === "accept" ? "Partner diterima!" : "Ditolak");
    load();
  };

  const active = partners.filter(p => p.status === "active");
  const pending = partners.filter(p => p.status === "pending");

  if (status === "loading") return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="skeleton h-8 w-32" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" /></Link>
          <h1 className="font-serif text-lg text-slate-900 dark:text-slate-100">Partner Doa</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-5 ring-1 ring-rose-100/60 dark:ring-rose-800/40 text-center">
          <Heart className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <h2 className="font-serif text-lg text-slate-900 dark:text-slate-100">Temukan Partner Doa</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Berdoa bersama partner yang saling mendukung dan menguatkan</p>
          <button onClick={handleMatch} disabled={matching}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
            <UserPlus className="h-4 w-4" /> {matching ? "Mencari..." : "Cari Partner Doa"}
          </button>
        </div>

        {active.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Partner Aktif</h3>
            <div className="space-y-2">
              {active.map(p => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    {p.partnerImage ? <Image src={p.partnerImage} alt="" width={40} height={40} className="h-full w-full object-cover" /> :
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{(p.partnerName || "?")[0].toUpperCase()}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.partnerName || "Partner Doa"}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Aktif</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Menunggu Respon</h3>
            <div className="space-y-2">
              {pending.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{(p.partnerName || "?")[0].toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.partnerName || "Pengguna"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleRespond(p.id, "accept")} className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"><Check className="h-4 w-4" /></button>
                    <button onClick={() => handleRespond(p.id, "decline")} className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"><X className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && active.length === 0 && pending.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">Belum ada partner doa. Klik tombol di atas untuk mencari!</p>
          </div>
        )}
      </main>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
