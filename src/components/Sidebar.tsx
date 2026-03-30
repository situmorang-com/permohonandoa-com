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
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-64 flex-col bg-white dark:bg-slate-900 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/25">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-lg text-slate-900 dark:text-white">permohonandoa.com</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wide">Berdoa bersama, berkat berlimpah</p>
        </div>
      </div>

      {/* User info */}
      {session?.user && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {session.user.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">0 hari streak</span>
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
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500"
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
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3">
        <span className="text-[10px] text-slate-400">v1.0</span>
        <DarkModeToggle />
      </div>
    </aside>
  );
}
