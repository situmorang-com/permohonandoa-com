import { NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq, sum, count } from "drizzle-orm";

export async function GET() {
  const [totalResult] = await db.select({ value: count() }).from(prayerRequests);
  const [answeredResult] = await db
    .select({ value: count() })
    .from(prayerRequests)
    .where(eq(prayerRequests.isAnswered, true));
  const [prayerCountResult] = await db
    .select({ value: sum(prayerRequests.prayerCount) })
    .from(prayerRequests);

  return NextResponse.json({
    total: totalResult.value,
    answered: answeredResult.value,
    prayerCount: Number(prayerCountResult.value) || 0,
  });
}
