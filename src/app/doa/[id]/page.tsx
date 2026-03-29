import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PrayerDetailClient from "./PrayerDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [prayer] = await db
    .select()
    .from(prayerRequests)
    .where(eq(prayerRequests.id, id));

  if (!prayer) return { title: "Doa Tidak Ditemukan" };

  const name = prayer.isAnonymous ? "Hamba Tuhan" : prayer.name;
  const description = prayer.content.substring(0, 160);

  return {
    title: `Permohonan Doa dari ${name} — PermohonanDoa.com`,
    description,
    openGraph: {
      title: `🙏 Permohonan Doa dari ${name}`,
      description,
      type: "article",
      siteName: "PermohonanDoa.com",
      images: [
        {
          url: `/api/og?id=${id}`,
          width: 1200,
          height: 630,
          alt: `Permohonan Doa dari ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `🙏 Permohonan Doa dari ${name}`,
      description,
      images: [`/api/og?id=${id}`],
    },
  };
}

export default async function PrayerDetailPage({ params }: Props) {
  const { id } = await params;
  const [prayer] = await db
    .select()
    .from(prayerRequests)
    .where(eq(prayerRequests.id, id));

  if (!prayer) notFound();

  return <PrayerDetailClient prayer={JSON.parse(JSON.stringify(prayer))} />;
}
