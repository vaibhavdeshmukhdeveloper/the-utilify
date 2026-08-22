import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Utilify - Free Online Productivity & Utility Tools Suite";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow backdrop circle */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Top Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#818cf8",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "24px",
          }}
        >
          ✨ 100% Free • Secure • In-Memory Processing
        </div>

        {/* Brand Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "#ffffff",
              fontWeight: 900,
            }}
          >
            U
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            Utilify
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#e4e4e7",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.3,
            marginBottom: "32px",
          }}
        >
          Professional Web Utilities & Calculators. Simplified.
        </div>

        {/* Features Row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["AI Background Remover", "PDF to Image & Merge", "Image Compressor", "SIP & Wealth Calculator", "JSON Formatter"].map(
            (tool, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#a1a1aa",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {tool}
              </div>
            )
          )}
        </div>

        {/* Domain Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            color: "#71717a",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          www.theutilify.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
