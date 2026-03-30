import { NextResponse } from "next/server";
import { db } from "@/db";
import { prayerPartners, users } from "@/db/schema";
import { eq, or, and, ne } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const partners = await db
    .select({
      id: prayerPartners.id,
      userId: prayerPartners.userId,
      partnerId: prayerPartners.partnerId,
      status: prayerPartners.status,
      createdAt: prayerPartners.createdAt,
    })
    .from(prayerPartners)
    .where(
      or(
        eq(prayerPartners.userId, session.user.id),
        eq(prayerPartners.partnerId, session.user.id)
      )
    );

  // Enrich with user info
  const enriched = await Promise.all(
    partners.map(async (p) => {
      const otherUserId =
        p.userId === session.user!.id ? p.partnerId : p.userId;
      const [otherUser] = await db
        .select({ id: users.id, name: users.name, image: users.image })
        .from(users)
        .where(eq(users.id, otherUserId));
      return { ...p, partner: otherUser };
    })
  );

  return NextResponse.json(enriched);
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try to find another pending user to match with
  const pendingPartner = await db
    .select()
    .from(prayerPartners)
    .where(
      and(
        eq(prayerPartners.status, "pending"),
        ne(prayerPartners.userId, session.user.id)
      )
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (pendingPartner) {
    // Match with existing pending request
    const [updated] = await db
      .update(prayerPartners)
      .set({
        partnerId: session.user.id,
        status: "active",
      })
      .where(eq(prayerPartners.id, pendingPartner.id))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  }

  // No pending match - create a new pending request
  const [partner] = await db
    .insert(prayerPartners)
    .values({
      userId: session.user.id,
      partnerId: session.user.id, // Placeholder, will be updated on match
      status: "pending",
    })
    .returning();

  return NextResponse.json(partner, { status: 201 });
}
