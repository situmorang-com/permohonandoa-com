import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { challengeParticipants, prayerChallenges } from "@/db/schema";
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

  const participant = await db
    .select()
    .from(challengeParticipants)
    .where(
      and(
        eq(challengeParticipants.challengeId, id),
        eq(challengeParticipants.userId, session.user.id)
      )
    )
    .then((rows) => rows[0]);

  if (!participant) {
    return NextResponse.json(
      { error: "Not a participant of this challenge" },
      { status: 404 }
    );
  }

  // Get challenge to check goal
  const challenge = await db
    .select()
    .from(prayerChallenges)
    .where(eq(prayerChallenges.id, id))
    .then((rows) => rows[0]);

  const newProgress = participant.progress + 1;
  const completed =
    challenge && newProgress >= challenge.goalTarget && !participant.completedAt;

  await db
    .update(challengeParticipants)
    .set({
      progress: sql`${challengeParticipants.progress} + 1`,
      ...(completed ? { completedAt: new Date() } : {}),
    })
    .where(
      and(
        eq(challengeParticipants.challengeId, id),
        eq(challengeParticipants.userId, session.user.id)
      )
    );

  return NextResponse.json({
    progress: newProgress,
    completed: !!completed,
    goalTarget: challenge?.goalTarget,
  });
}
