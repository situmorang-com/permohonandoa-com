"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Church, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ShareToast from "@/components/ShareToast";

interface ChurchData { id: string; name: string; description: string | null; city: string | null; memberCount: number; inviteCode: string | null; }

export default function ChurchesPage() {
  const { data: session } = useSession();
  const [churches, setChurches] = useState<ChurchData[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState(""); const [desc, setDesc] = useState("");
  const [address, setAddress] = useState(""); const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  const load = async () => { setLoading(true); const r = await fetch("/api/churches"); setChurches(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const filtered = churches.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.city || "").toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/churches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: desc, address, city }) });
    setShowCreate(false); setName(""); setDesc(""); setAddress(""); setCity("");
    showToast("Gereja berhasil ditambahkan!"); load();
  };

  const handleJoin = async (id: string) => {
    await fetch(`/api/churches/${id}/join`, { method: "POST" });
    showToast("Berhasil bergabung!"); load();
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-stone-200/60">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg p-2 hover:bg-stone-100"><ArrowLeft className="h-5 w-5 text-stone-600" /></Link>
            <h1 className="font-serif text-lg text-stone-900">Gereja Saya</h1>
          </div>
          {session && <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" /> Tambah</button>}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input type="text" placeholder="Cari gereja..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border-2 border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400 placeholder:text-stone-400" />
        </div>

        {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div> :
          filtered.length === 0 ? (
            <div className="text-center py-16">
              <Church className="mx-auto h-10 w-10 text-stone-300 mb-3" />
              <p className="font-serif text-lg text-stone-700">Belum ada gereja</p>
              <p className="text-sm text-stone-400 mt-1">Tambahkan gerejamu ke komunitas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(c => (
                <div key={c.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 hover:shadow-md transition-shadow">
                  <Link href={`/gereja/${c.id}`}>
                    <h3 className="font-semibold text-stone-800">{c.name}</h3>
                    {c.city && <p className="flex items-center gap-1 text-xs text-stone-400 mt-0.5"><MapPin className="h-3 w-3" />{c.city}</p>}
                    {c.description && <p className="text-sm text-stone-500 mt-1 line-clamp-2">{c.description}</p>}
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">{c.memberCount} anggota</span>
                    <button onClick={() => handleJoin(c.id)} className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800">Gabung</button>
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
                <h2 className="font-serif text-xl text-stone-900">Tambah Gereja</h2>
                <button onClick={() => setShowCreate(false)} className="rounded-lg p-2 hover:bg-stone-50"><X className="h-5 w-5 text-stone-400" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <input type="text" placeholder="Nama gereja" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-amber-400 placeholder:text-stone-400" />
                <textarea placeholder="Deskripsi (opsional)" value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-amber-400 placeholder:text-stone-400 resize-none" />
                <input type="text" placeholder="Alamat" value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-amber-400 placeholder:text-stone-400" />
                <input type="text" placeholder="Kota" value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-xl border-2 border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-amber-400 placeholder:text-stone-400" />
                <button type="submit" disabled={!name.trim()} className="w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-30">Tambah Gereja</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
