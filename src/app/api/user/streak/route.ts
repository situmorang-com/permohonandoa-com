import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST() {
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

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (user.lastPrayedAt) {
    const lastPrayed = new Date(user.lastPrayedAt);
    const lastPrayedDay = new Date(
      lastPrayed.getFullYear(),
      lastPrayed.getMonth(),
      lastPrayed.getDate()
    );

    // Already prayed today - no-op
    if (lastPrayedDay.getTime() === today.getTime()) {
      return NextResponse.json({
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalPrayed: user.totalPrayed,
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak: number;
    if (lastPrayedDay.getTime() === yesterday.getTime()) {
      // Prayed yesterday - increment streak
      newStreak = user.currentStreak + 1;
    } else {
      // Missed a day - reset streak
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, user.longestStreak);
    const newTotal = user.totalPrayed + 1;

    await db
      .update(users)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalPrayed: newTotal,
        lastPrayedAt: now,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalPrayed: newTotal,
    });
  }

  // First time praying
  await db
    .update(users)
    .set({
      currentStreak: 1,
      longestStreak: Math.max(1, user.longestStreak),
      totalPrayed: user.totalPrayed + 1,
      lastPrayedAt: now,
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({
    currentStreak: 1,
    longestStreak: Math.max(1, user.longestStreak),
    totalPrayed: user.totalPrayed + 1,
  });
}
