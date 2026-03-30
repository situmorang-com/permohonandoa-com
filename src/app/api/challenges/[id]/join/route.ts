import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerChallenges, challengeParticipants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const challenge = await db
    .select()
    .from(prayerChallenges)
    .where(eq(prayerChallenges.id, id))
    .then((rows) => rows[0]);

  if (!challenge) {
    return NextResponse.json(
      { error: "Challenge not found" },
      { status: 404 }
    );
  }

  try {
    await db.insert(challengeParticipants).values({
      challengeId: id,
      userId: session.user.id,
    });

    await db
      .update(prayerChallenges)
      .set({
        participantCount: sql`${prayerChallenges.participantCount} + 1`,
      })
      .where(eq(prayerChallenges.id, id));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Already joined this challenge" },
      { status: 409 }
    );
  }
}
