import type { Metadata } from "next";
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
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-stone-800 antialiased">{children}</body>
    </html>
  );
}
