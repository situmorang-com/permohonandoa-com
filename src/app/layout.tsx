import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "PermohonanDoa.com — Bagikan Permohonan Doamu",
  description:
    "Platform komunitas Kristen untuk membagikan permohonan doa, mendoakan sesama, dan merayakan doa yang dijawab Tuhan.",
  openGraph: {
    title: "PermohonanDoa.com",
    description: "Bagikan permohonan doamu, mendoakan sesama, dan merayakan jawaban doa.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-slate-800 dark:text-slate-200 antialiased">
        <SessionProvider>
          <Sidebar />
          <div className="md:pl-64">
            {children}
          </div>
          <BottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}
