import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { and, eq, isNotNull, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const radius = parseFloat(searchParams.get("radius") || "50"); // km

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  // Simple distance calculation using the Haversine approximation
  // distance in km ~ 111.045 * sqrt((lat2-lat1)^2 + (cos(lat1*pi/180)*(lng2-lng1))^2)
  const distanceExpression = sql`
    111.045 * sqrt(
      power(${prayerRequests.latitude} - ${lat}, 2) +
      power(cos(${lat} * 3.14159265 / 180) * (${prayerRequests.longitude} - ${lng}), 2)
    )
  `;

  const prayers = await db
    .select({
      id: prayerRequests.id,
      name: prayerRequests.name,
      category: prayerRequests.category,
      content: prayerRequests.content,
      isAnonymous: prayerRequests.isAnonymous,
      prayerCount: prayerRequests.prayerCount,
      location: prayerRequests.location,
      latitude: prayerRequests.latitude,
      longitude: prayerRequests.longitude,
      createdAt: prayerRequests.createdAt,
      distance: distanceExpression.as("distance"),
    })
    .from(prayerRequests)
    .where(
      and(
        eq(prayerRequests.isPublic, true),
        isNotNull(prayerRequests.latitude),
        isNotNull(prayerRequests.longitude),
        sql`${distanceExpression} <= ${radius}`
      )
    )
    .orderBy(sql`${distanceExpression} ASC`)
    .limit(50);

  return NextResponse.json(prayers);
}
