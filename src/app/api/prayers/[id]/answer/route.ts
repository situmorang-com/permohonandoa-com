import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const [prayer] = await db
    .update(prayerRequests)
    .set({
      isAnswered: true,
      answeredAt: new Date(),
      answeredTestimony: body.testimony || null,
    })
    .where(eq(prayerRequests.id, id))
    .returning();

  return NextResponse.json(prayer);
}
