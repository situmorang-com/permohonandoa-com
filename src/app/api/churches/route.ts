import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { churches, churchMembers } from "@/db/schema";
import { auth } from "@/auth";

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  const allChurches = await db.select().from(churches);
  return NextResponse.json(allChurches);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, address, city } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const inviteCode = generateInviteCode();

  const [church] = await db
    .insert(churches)
    .values({
      name,
      description: description || null,
      address: address || null,
      city: city || null,
      adminId: session.user.id,
      inviteCode,
      memberCount: 1,
    })
    .returning();

  // Add creator as admin member
  await db.insert(churchMembers).values({
    churchId: church.id,
    userId: session.user.id,
    role: "admin",
  });

  return NextResponse.json(church, { status: 201 });
}
