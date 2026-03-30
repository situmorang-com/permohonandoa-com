import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerChallenges } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const challenges = await db
    .select()
    .from(prayerChallenges)
    .where(eq(prayerChallenges.isActive, true));

  return NextResponse.json(challenges);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admin-only check (simple: could be extended with a proper role system)
  // For now we allow authenticated users to create challenges
  const { title, description, image, startDate, endDate, goalType, goalTarget } =
    await request.json();

  if (!title || !description || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Title, description, startDate, and endDate are required" },
      { status: 400 }
    );
  }

  const [challenge] = await db
    .insert(prayerChallenges)
    .values({
      title,
      description,
      image: image || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      goalType: goalType || "days",
      goalTarget: goalTarget || 7,
    })
    .returning();

  return NextResponse.json(challenge, { status: 201 });
}
