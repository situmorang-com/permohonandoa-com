import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerGroups, groupMembers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;

  const group = await db
    .select()
    .from(prayerGroups)
    .where(eq(prayerGroups.inviteCode, code))
    .then((rows) => rows[0]);

  if (!group) {
    return NextResponse.json(
      { error: "Invalid invite code" },
      { status: 404 }
    );
  }

  try {
    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: session.user.id,
      role: "member",
    });

    await db
      .update(prayerGroups)
      .set({ memberCount: sql`${prayerGroups.memberCount} + 1` })
      .where(eq(prayerGroups.id, group.id));

    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Already a member of this group" },
      { status: 409 }
    );
  }
}
