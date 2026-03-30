import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerGroups, groupMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  const groups = await db
    .select()
    .from(prayerGroups)
    .where(eq(prayerGroups.isPublic, true));

  return NextResponse.json(groups);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, isPublic } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const inviteCode = generateInviteCode();

  const [group] = await db
    .insert(prayerGroups)
    .values({
      name,
      description: description || null,
      isPublic: isPublic ?? true,
      creatorId: session.user.id,
      inviteCode,
    })
    .returning();

  // Add creator as admin member
  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: session.user.id,
    role: "admin",
  });

  return NextResponse.json(group, { status: 201 });
}
