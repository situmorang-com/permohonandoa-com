import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prayerRequestId, commentId, reason } = await request.json();

  if (!reason) {
    return NextResponse.json({ error: "Reason is required" }, { status: 400 });
  }

  if (!prayerRequestId && !commentId) {
    return NextResponse.json(
      { error: "Either prayerRequestId or commentId is required" },
      { status: 400 }
    );
  }

  const [report] = await db
    .insert(reports)
    .values({
      reporterId: session.user.id,
      prayerRequestId: prayerRequestId || null,
      commentId: commentId || null,
      reason,
    })
    .returning();

  return NextResponse.json(report, { status: 201 });
}
