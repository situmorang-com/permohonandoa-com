import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

// GET comments for a prayer
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userName: users.name,
      userImage: users.image,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.prayerRequestId, id))
    .orderBy(desc(comments.createdAt));

  return NextResponse.json(result);
}

// POST a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Harus masuk untuk mengomentari" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Komentar tidak boleh kosong" }, { status: 400 });
  }

  const [comment] = await db
    .insert(comments)
    .values({
      prayerRequestId: id,
      userId: session.user.id,
      content: body.content.trim(),
    })
    .returning();

  return NextResponse.json({
    ...comment,
    userName: session.user.name,
    userImage: session.user.image,
  }, { status: 201 });
}
