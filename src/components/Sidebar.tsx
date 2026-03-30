"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Target,
  Church,
  Handshake,
  Bell,
  BookOpen,
  User,
  Flame,
} from "lucide-react";
import Image from "next/image";
import DarkModeToggle from "./DarkModeToggle";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/grup", icon: Users, label: "Grup Doa" },
  { href: "/tantangan", icon: Target, label: "Tantangan" },
  { href: "/gereja", icon: Church, label: "Gereja Saya" },
  { href: "/partner", icon: Handshake, label: "Partner Doa" },
  { href: "/pengingat", icon: Bell, label: "Pengingat" },
  { href: "/doaku", icon: BookOpen, label: "Doa Saya" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-64 flex-col border-r border-stone-200/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md shadow-amber-600/20">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-lg text-stone-900 dark:text-stone-100">PermohonanDoa</h1>
          <p className="text-[10px] text-stone-400 tracking-wide">Berdoa bersama</p>
        </div>
      </div>

      {/* User info */}
      {session?.user && (
        <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-stone-200 dark:ring-stone-700">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-stone-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame className="h-3 w-3 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">0 hari streak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 px-5 py-3">
        <span className="text-[10px] text-stone-400">v1.0</span>
        <DarkModeToggle />
      </div>
    </aside>
  );
}
