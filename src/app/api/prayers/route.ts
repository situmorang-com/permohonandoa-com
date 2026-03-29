import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests, prayerUpdates } from "@/db/schema";
import { desc, eq, ilike, or, sql, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tab = searchParams.get("tab");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const conditions = [];

  if (tab === "permohonan") conditions.push(eq(prayerRequests.isAnswered, false));
  if (tab === "dijawab") conditions.push(eq(prayerRequests.isAnswered, true));
  if (category && category !== "semua") conditions.push(eq(prayerRequests.category, category));
  if (search) {
    conditions.push(
      or(
        ilike(prayerRequests.content, `%${search}%`),
        ilike(prayerRequests.name, `%${search}%`)
      )!
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const prayers = await db
    .select()
    .from(prayerRequests)
    .where(where)
    .orderBy(desc(prayerRequests.isUrgent), desc(prayerRequests.createdAt));

  // Fetch updates for each prayer
  const prayerIds = prayers.map((p) => p.id);
  const updates = prayerIds.length > 0
    ? await db
        .select()
        .from(prayerUpdates)
        .where(sql`${prayerUpdates.prayerRequestId} IN ${prayerIds}`)
        .orderBy(desc(prayerUpdates.createdAt))
    : [];

  const prayersWithUpdates = prayers.map((p) => ({
    ...p,
    updates: updates.filter((u) => u.prayerRequestId === p.id),
  }));

  return NextResponse.json(prayersWithUpdates);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const body = await request.json();
  const { name, category, content, isAnonymous, isUrgent, scriptureVerse } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Permohonan doa tidak boleh kosong" }, { status: 400 });
  }

  const userName = isAnonymous
    ? "Hamba Tuhan"
    : (name?.trim() || session?.user?.name || "Hamba Tuhan");

  const [prayer] = await db
    .insert(prayerRequests)
    .values({
      userId: session?.user?.id || null,
      name: userName,
      category: category || "lainnya",
      content: content.trim(),
      isAnonymous: !!isAnonymous,
      isUrgent: !!isUrgent,
      scriptureVerse: scriptureVerse?.trim() || null,
    })
    .returning();

  return NextResponse.json(prayer, { status: 201 });
}
