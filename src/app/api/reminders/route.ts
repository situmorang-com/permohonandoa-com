import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerReminders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reminders = await db
    .select()
    .from(prayerReminders)
    .where(eq(prayerReminders.userId, session.user.id));

  return NextResponse.json(reminders);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prayerRequestId, time, days } = await request.json();

  if (!time || !days) {
    return NextResponse.json(
      { error: "Time and days are required" },
      { status: 400 }
    );
  }

  const [reminder] = await db
    .insert(prayerReminders)
    .values({
      userId: session.user.id,
      prayerRequestId: prayerRequestId || null,
      time,
      days,
    })
    .returning();

  return NextResponse.json(reminder, { status: 201 });
}
