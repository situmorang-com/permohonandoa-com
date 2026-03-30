import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerPartners } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { action } = await request.json();

  if (action !== "accept" && action !== "decline") {
    return NextResponse.json(
      { error: "Action must be 'accept' or 'decline'" },
      { status: 400 }
    );
  }

  const partner = await db
    .select()
    .from(prayerPartners)
    .where(
      and(
        eq(prayerPartners.id, id),
        or(
          eq(prayerPartners.userId, session.user.id),
          eq(prayerPartners.partnerId, session.user.id)
        )
      )
    )
    .then((rows) => rows[0]);

  if (!partner) {
    return NextResponse.json(
      { error: "Partner request not found" },
      { status: 404 }
    );
  }

  if (action === "accept") {
    const [updated] = await db
      .update(prayerPartners)
      .set({ status: "active" })
      .where(eq(prayerPartners.id, id))
      .returning();

    return NextResponse.json(updated);
  }

  // decline
  const [updated] = await db
    .update(prayerPartners)
    .set({ status: "ended" })
    .where(eq(prayerPartners.id, id))
    .returning();

  return NextResponse.json(updated);
}
