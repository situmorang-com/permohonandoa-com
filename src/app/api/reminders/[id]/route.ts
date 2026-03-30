import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerReminders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const deleted = await db
    .delete(prayerReminders)
    .where(
      and(
        eq(prayerReminders.id, id),
        eq(prayerReminders.userId, session.user.id)
      )
    )
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: "Reminder not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const reminder = await db
    .select()
    .from(prayerReminders)
    .where(
      and(
        eq(prayerReminders.id, id),
        eq(prayerReminders.userId, session.user.id)
      )
    )
    .then((rows) => rows[0]);

  if (!reminder) {
    return NextResponse.json(
      { error: "Reminder not found" },
      { status: 404 }
    );
  }

  const [updated] = await db
    .update(prayerReminders)
    .set({ isActive: !reminder.isActive })
    .where(eq(prayerReminders.id, id))
    .returning();

  return NextResponse.json(updated);
}
