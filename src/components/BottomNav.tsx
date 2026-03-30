"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Target, Church, User } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/grup", icon: Users, label: "Grup" },
  { href: "/tantangan", icon: Target, label: "Tantangan" },
  { href: "/gereja", icon: Church, label: "Gereja" },
  { href: "/doaku", icon: User, label: "Doaku" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="glass border-t border-stone-200/60 dark:border-stone-800/60 bg-white/90 dark:bg-stone-900/90 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
