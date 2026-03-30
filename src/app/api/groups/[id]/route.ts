import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerGroups, groupMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const group = await db
    .select()
    .from(prayerGroups)
    .where(eq(prayerGroups.id, id))
    .then((rows) => rows[0]);

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const members = await db
    .select({
      userId: groupMembers.userId,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
      name: users.name,
      image: users.image,
    })
    .from(groupMembers)
    .innerJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(groupMembers.groupId, id));

  return NextResponse.json({ ...group, members });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const group = await db
    .select()
    .from(prayerGroups)
    .where(
      and(eq(prayerGroups.id, id), eq(prayerGroups.creatorId, session.user.id))
    )
    .then((rows) => rows[0]);

  if (!group) {
    return NextResponse.json(
      { error: "Group not found or not authorized" },
      { status: 404 }
    );
  }

  await db.delete(prayerGroups).where(eq(prayerGroups.id, id));

  return NextResponse.json({ success: true });
}
