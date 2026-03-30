import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { churches, churchMembers } from "@/db/schema";
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

  const church = await db
    .select()
    .from(churches)
    .where(eq(churches.inviteCode, code))
    .then((rows) => rows[0]);

  if (!church) {
    return NextResponse.json(
      { error: "Invalid invite code" },
      { status: 404 }
    );
  }

  try {
    await db.insert(churchMembers).values({
      churchId: church.id,
      userId: session.user.id,
      role: "member",
    });

    await db
      .update(churches)
      .set({ memberCount: sql`${churches.memberCount} + 1` })
      .where(eq(churches.id, church.id));

    return NextResponse.json({ success: true, church }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Already a member of this church" },
      { status: 409 }
    );
  }
}
