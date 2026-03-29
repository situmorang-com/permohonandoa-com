import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #faf7f2, #f5f0ea)",
            fontFamily: "serif",
          }}
        >
          <div style={{ fontSize: 64, color: "#44403c" }}>🙏</div>
          <div style={{ fontSize: 40, color: "#292524", marginTop: 16 }}>PermohonanDoa.com</div>
          <div style={{ fontSize: 20, color: "#78716c", marginTop: 8 }}>Berdoa bersama, berkat berlimpah</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const [prayer] = await db.select().from(prayerRequests).where(eq(prayerRequests.id, id));

  if (!prayer) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf7f2" }}>
          <div style={{ fontSize: 32, color: "#78716c" }}>Doa tidak ditemukan</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const name = prayer.isAnonymous ? "Hamba Tuhan" : prayer.name;
  const content = prayer.content.length > 200 ? prayer.content.substring(0, 200) + "..." : prayer.content;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #faf7f2 0%, #f5f0ea 50%, #fef3c7 100%)",
          padding: 60,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #b45309, #92400e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
            }}
          >
            🙏
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#292524" }}>Permohonan Doa</div>
            <div style={{ fontSize: 16, color: "#78716c" }}>PermohonanDoa.com</div>
          </div>
          {prayer.isAnswered && (
            <div
              style={{
                marginLeft: "auto",
                background: "#d1fae5",
                color: "#047857",
                padding: "8px 20px",
                borderRadius: 30,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              ✅ Doa Dijawab!
            </div>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.5,
              color: "#1c1917",
              fontStyle: "italic",
            }}
          >
            &ldquo;{content}&rdquo;
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#e7e5e4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#78716c",
              }}
            >
              {name[0].toUpperCase()}
            </div>
            <div style={{ fontSize: 20, color: "#44403c", fontWeight: 600 }}>{name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, color: "#78716c" }}>
            ❤️ {prayer.prayerCount} orang mendoakan
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
