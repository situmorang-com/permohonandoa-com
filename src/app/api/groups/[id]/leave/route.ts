import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerGroups, groupMembers } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const deleted = await db
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, id),
        eq(groupMembers.userId, session.user.id)
      )
    )
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: "Not a member of this group" },
      { status: 404 }
    );
  }

  await db
    .update(prayerGroups)
    .set({ memberCount: sql`GREATEST(${prayerGroups.memberCount} - 1, 0)` })
    .where(eq(prayerGroups.id, id));

  return NextResponse.json({ success: true });
}
