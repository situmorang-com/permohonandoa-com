import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [prayer] = await db
    .update(prayerRequests)
    .set({ prayerCount: sql`${prayerRequests.prayerCount} + 1` })
    .where(eq(prayerRequests.id, id))
    .returning();

  return NextResponse.json(prayer);
}
