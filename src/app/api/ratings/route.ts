import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export interface ToolRatingData {
  sum: number;
  count: number;
  ratings?: { [star: number]: number };
}

// In-memory cache for ultra-fast fallback
const ratingsStore: Record<string, ToolRatingData> = {};

// Ephemeral /tmp storage file for serverless environments
const DATA_FILE = path.join(os.tmpdir(), "utilify_ratings_cache.json");

function loadLocalRatings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      Object.assign(ratingsStore, data);
    }
  } catch {
    // Ignore in read-only / restricted environments
  }
}

function saveLocalRatings() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(ratingsStore, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

loadLocalRatings();

function getBackendUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8000";
  return url.replace(/\/+$/, "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get("tool")?.replace(/^\//, "").split("?")[0];
  const backendUrl = getBackendUrl();

  // Try fetching from Google Cloud Run backend first
  try {
    const backendRes = await fetch(`${backendUrl}/api/ratings${tool ? `?tool=${encodeURIComponent(tool)}` : ""}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
        },
      });
    }
  } catch {
    // Backend unreachable or local dev mode fallback
  }

  // Fallback to local memory / temp file
  loadLocalRatings();
  if (tool) {
    const data = ratingsStore[tool] || { sum: 0, count: 0 };
    const ratingValue = data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0;
    return NextResponse.json({
      tool,
      ratingValue,
      reviewCount: data.count,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
      },
    });
  }

  const all: Record<string, { ratingValue: number; reviewCount: number }> = {};
  for (const [key, data] of Object.entries(ratingsStore)) {
    all[key] = {
      ratingValue: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0,
      reviewCount: data.count,
    };
  }

  return NextResponse.json(all, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, rating } = body;

    if (!tool || typeof tool !== "string") {
      return NextResponse.json({ error: "Invalid tool slug" }, { status: 400 });
    }

    const star = parseInt(rating, 10);
    if (isNaN(star) || star < 1 || star > 5) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }

    const normalizedTool = tool.replace(/^\//, "").split("?")[0];
    const backendUrl = getBackendUrl();

    // 1. Submit to FastAPI Cloud Run backend for permanent persistence
    try {
      const backendRes = await fetch(`${backendUrl}/api/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: normalizedTool, rating: star }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        // Also update local cache
        ratingsStore[normalizedTool] = {
          sum: (ratingsStore[normalizedTool]?.sum || 0) + star,
          count: (ratingsStore[normalizedTool]?.count || 0) + 1,
        };
        saveLocalRatings();

        return NextResponse.json(data);
      }
    } catch {
      // Backend unreachable fallback
    }

    // 2. Local fallback update
    loadLocalRatings();
    if (!ratingsStore[normalizedTool]) {
      ratingsStore[normalizedTool] = { sum: 0, count: 0 };
    }

    ratingsStore[normalizedTool].sum += star;
    ratingsStore[normalizedTool].count += 1;
    saveLocalRatings();

    const data = ratingsStore[normalizedTool];
    const ratingValue = parseFloat((data.sum / data.count).toFixed(1));

    return NextResponse.json({
      success: true,
      tool: normalizedTool,
      ratingValue,
      reviewCount: data.count,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Failed to process rating",
    }, { status: 500 });
  }
}
