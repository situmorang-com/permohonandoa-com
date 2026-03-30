"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, Plus, Trash2, X, Clock } from "lucide-react";
import Link from "next/link";
import ShareToast from "@/components/ShareToast";

interface Reminder { id: string; time: string; days: number[]; isActive: boolean; prayerRequestId: string | null; }
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function RemindersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [time, setTime] = useState("07:00");
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => { if (status === "unauthenticated") router.push("/masuk"); }, [status, router]);

  const load = async () => { setLoading(true); const r = await fetch("/api/reminders"); setReminders(await r.json()); setLoading(false); };
  useEffect(() => { if (session) load(); }, [session]);

  const toggleDay = (d: number) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ time, days }) });
    setShowCreate(false); setTime("07:00"); setDays([0, 1, 2, 3, 4, 5, 6]);
    showToast("Pengingat berhasil dibuat!"); load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
    showToast("Pengingat dihapus"); load();
  };

  const handleToggle = async (id: string) => {
    await fetch(`/api/reminders/${id}`, { method: "PATCH" });
    load();
  };

  if (status === "loading") return <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center"><div className="skeleton h-8 w-32" /></div>;

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-stone-200/60">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg p-2 hover:bg-stone-100"><ArrowLeft className="h-5 w-5 text-stone-600" /></Link>
            <h1 className="font-serif text-lg text-stone-900">Pengingat Doa</h1>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" /> Tambah</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        {loading ? <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div> :
          reminders.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="mx-auto h-10 w-10 text-stone-300 mb-3" />
              <p className="font-serif text-lg text-stone-700">Belum ada pengingat</p>
              <p className="text-sm text-stone-400 mt-1">Atur pengingat agar tidak lupa berdoa setiap hari</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map(r => (
                <div key={r.id} className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 ${!r.isActive ? "opacity-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-xl font-bold text-stone-900">{r.time}</p>
                        <div className="flex gap-1 mt-1">
                          {DAY_NAMES.map((d, i) => (
                            <span key={i} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.days.includes(i) ? "bg-amber-100 text-amber-700" : "text-stone-300"}`}>{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggle(r.id)} className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${r.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>
                        {r.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </main>

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl sm:m-4">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl text-stone-900">Pengingat Baru</h2>
                <button onClick={() => setShowCreate(false)} className="rounded-lg p-2 hover:bg-stone-50"><X className="h-5 w-5 text-stone-400" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Waktu</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-2xl font-bold text-stone-900 outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Hari</label>
                  <div className="mt-2 flex gap-1.5">
                    {DAY_NAMES.map((d, i) => (
                      <button key={i} type="button" onClick={() => toggleDay(i)}
                        className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${days.includes(i) ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-400"}`}>{d}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white">Simpan Pengingat</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
