import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, prayerRequests } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db
    .select({
      currentStreak: users.currentStreak,
      longestStreak: users.longestStreak,
      totalPrayed: users.totalPrayed,
      lastPrayedAt: users.lastPrayedAt,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [submitted] = await db
    .select({ count: count() })
    .from(prayerRequests)
    .where(eq(prayerRequests.userId, session.user.id));

  const [answered] = await db
    .select({ count: count() })
    .from(prayerRequests)
    .where(
      and(
        eq(prayerRequests.userId, session.user.id),
        eq(prayerRequests.isAnswered, true)
      )
    );

  return NextResponse.json({
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    totalPrayed: user.totalPrayed,
    lastPrayedAt: user.lastPrayedAt,
    prayersSubmitted: submitted.count,
    prayersAnswered: answered.count,
  });
}
