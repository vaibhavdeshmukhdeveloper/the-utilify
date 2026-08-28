import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "The Utilify - Free Online Productivity Tools";
    const description = searchParams.get("description") || "Professional-grade, privacy-first free online utilities. Fast, client-side, zero file retention.";
    const category = searchParams.get("category") || "Utility Suite";
    const badge = searchParams.get("badge") || "100% Free • Privacy First";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.18) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 40%)",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Bar: Brand & Badges */}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 900,
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                }}
              >
                U
              </div>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  color: "#ffffff",
                }}
              >
                Utilify
              </span>
            </div>

            {/* Category / Pill Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  color: "#818cf8",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </div>
            </div>
          </div>

          {/* Center Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "1050px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 35 ? "50px" : "60px",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-1.5px",
                color: "#f4f4f5",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "22px",
                lineHeight: 1.45,
                color: "#a1a1aa",
                maxWidth: "920px",
                fontWeight: 400,
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom Footer Details */}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#71717a",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <span>🌐</span>
              <span>www.theutilify.com</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#10b981",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              <span>✨</span>
              <span>{badge}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to generate OG image";
    return new Response(message, { status: 500 });
  }
}
