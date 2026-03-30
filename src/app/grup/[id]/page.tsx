"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Users, Copy, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ShareToast from "@/components/ShareToast";

interface GroupDetail {
  id: string; name: string; description: string | null; memberCount: number;
  isPublic: boolean; inviteCode: string | null; createdAt: string;
  members: { userId: string; role: string; userName: string | null; userImage: string | null }[];
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (m: string) => { setToast({ message: m, visible: true }); setTimeout(() => setToast({ message: "", visible: false }), 2500); };

  useEffect(() => {
    fetch(`/api/groups/${id}`).then(r => r.json()).then(d => { setGroup(d); setLoading(false); });
  }, [id]);

  const copyInvite = async () => {
    if (group?.inviteCode) {
      await navigator.clipboard.writeText(`${window.location.origin}/grup/join/${group.inviteCode}`);
      showToast("Link undangan disalin!");
    }
  };

  const handleLeave = async () => {
    await fetch(`/api/groups/${id}/leave`, { method: "POST" });
    window.location.href = "/grup";
  };

  if (loading) return <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center"><div className="skeleton h-8 w-40" /></div>;
  if (!group) return <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center"><p className="text-stone-400">Grup tidak ditemukan</p></div>;

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-24 md:pb-8">
      <header className="glass sticky top-0 z-40 border-b border-stone-200/60">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/grup" className="rounded-lg p-2 hover:bg-stone-100"><ArrowLeft className="h-5 w-5 text-stone-600" /></Link>
          <h1 className="font-serif text-lg text-stone-900 truncate">{group.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 space-y-5">
        {/* Group info */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="font-serif text-xl text-stone-900">{group.name}</h2>
          {group.description && <p className="mt-2 text-sm text-stone-500">{group.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {group.memberCount} anggota</span>
            <span className={`rounded-full px-2 py-0.5 font-semibold ${group.isPublic ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {group.isPublic ? "Publik" : "Privat"}
            </span>
          </div>
          {group.inviteCode && (
            <button onClick={copyInvite} className="mt-3 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100">
              <Copy className="h-3.5 w-3.5" /> Salin link undangan
            </button>
          )}
        </div>

        {/* Members */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <h3 className="text-sm font-bold text-stone-700 mb-3">Anggota ({group.members.length})</h3>
          <div className="space-y-2">
            {group.members.map(m => (
              <div key={m.userId} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-stone-100">
                  {m.userImage ? <Image src={m.userImage} alt="" width={32} height={32} className="h-full w-full object-cover" /> :
                    <span className="text-xs font-bold text-stone-500">{(m.userName || "?")[0].toUpperCase()}</span>}
                </div>
                <span className="text-sm text-stone-700">{m.userName || "Pengguna"}</span>
                {m.role === "admin" && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Admin</span>}
              </div>
            ))}
          </div>
        </div>

        {session && (
          <button onClick={handleLeave} className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200/50 hover:bg-red-100">
            <LogOut className="h-4 w-4" /> Keluar dari Grup
          </button>
        )}
      </main>
      <ShareToast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}
