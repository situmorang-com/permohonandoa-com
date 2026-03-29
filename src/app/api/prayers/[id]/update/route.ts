import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests, prayerUpdates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Update tidak boleh kosong" }, { status: 400 });
  }

  await db.insert(prayerUpdates).values({
    prayerRequestId: id,
    content: body.content.trim(),
  });

  // Update the updatedAt timestamp
  await db
    .update(prayerRequests)
    .set({ updatedAt: new Date() })
    .where(eq(prayerRequests.id, id));

  // Return the prayer with updates
  const [prayer] = await db
    .select()
    .from(prayerRequests)
    .where(eq(prayerRequests.id, id));

  const updates = await db
    .select()
    .from(prayerUpdates)
    .where(eq(prayerUpdates.prayerRequestId, id))
    .orderBy(desc(prayerUpdates.createdAt));

  return NextResponse.json({ ...prayer, updates });
}
