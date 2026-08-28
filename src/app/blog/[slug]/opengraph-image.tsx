import { ImageResponse } from "next/og";
import { blogPosts } from "@/lib/blog-data";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug) || {
    title: "The Utilify Editorial Guides & Productivity Tutorials",
    category: "Guides",
    readTime: "8 min read",
    author: "The Utilify Editorial Team",
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #111116 50%, #0c0d19 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
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
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0) 70%)",
            top: "20%",
            right: "5%",
          }}
        />

        {/* Top Bar: Brand & Category Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
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
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "#ffffff",
                fontWeight: 900,
              }}
            >
              U
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-1px",
              }}
            >
              Utilify
            </span>
          </div>

          {/* Category Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "#a5b4fc",
              fontSize: "16px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            {post.category}
          </div>
        </div>

        {/* Middle: Article Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "1050px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: post.title.length > 70 ? "46px" : "54px",
              fontWeight: 900,
              color: "#f8fafc",
              lineHeight: 1.18,
              letterSpacing: "-1.5px",
            }}
          >
            {post.title}
          </div>
        </div>

        {/* Bottom Bar: Meta info & domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              color: "#a1a1aa",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            <span>✍️ {post.author || "The Utilify Editorial Team"}</span>
            <span>⏱️ {post.readTime}</span>
          </div>

          <div
            style={{
              color: "#818cf8",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.5px",
            }}
          >
            theutilify.com/blog
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
