import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { churches, churchMembers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const church = await db
    .select()
    .from(churches)
    .where(eq(churches.id, id))
    .then((rows) => rows[0]);

  if (!church) {
    return NextResponse.json({ error: "Church not found" }, { status: 404 });
  }

  const members = await db
    .select({
      userId: churchMembers.userId,
      role: churchMembers.role,
      joinedAt: churchMembers.joinedAt,
      name: users.name,
      image: users.image,
    })
    .from(churchMembers)
    .innerJoin(users, eq(churchMembers.userId, users.id))
    .where(eq(churchMembers.churchId, id));

  return NextResponse.json({ ...church, members });
}
