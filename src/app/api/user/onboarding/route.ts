import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { location, preferredCategories } = body;

  const updateData: Record<string, unknown> = {
    onboardingCompleted: true,
  };

  if (location) {
    updateData.location = location;
  }

  // preferredCategories can be stored but the schema doesn't have a column for it yet
  // For now we just mark onboarding as completed with optional location

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
