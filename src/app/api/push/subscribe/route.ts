import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscription } = await request.json();

  if (!subscription) {
    return NextResponse.json(
      { error: "Subscription object is required" },
      { status: 400 }
    );
  }

  const [sub] = await db
    .insert(pushSubscriptions)
    .values({
      userId: session.user.id,
      subscription,
    })
    .returning();

  return NextResponse.json(sub, { status: 201 });
}
