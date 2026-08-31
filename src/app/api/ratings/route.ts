import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ToolRatingData {
  sum: number;
  count: number;
  ratings: { [star: number]: number };
}

// In-memory cache for ultra-fast zero-latency responses
const ratingsStore: Record<string, ToolRatingData> = {};

// Fallback file location in /tmp or data directory
const DATA_FILE = path.join(process.cwd(), ".next", "ratings-data.json");

function loadRatingsFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      Object.assign(ratingsStore, data);
    }
  } catch {
    // Ignore file load errors in ephemeral environments
  }
}

function saveRatingsToFile() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(ratingsStore, null, 2), "utf-8");
  } catch {
    // Ignore file write errors in read-only / ephemeral environments
  }
}

// Load existing ratings on cold start
loadRatingsFromFile();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get("tool")?.replace(/^\//, "").split("?")[0];

  if (tool) {
    const data = ratingsStore[tool] || { sum: 0, count: 0, ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const ratingValue = data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0;
    return NextResponse.json({
      tool,
      ratingValue,
      reviewCount: data.count,
      ratings: data.ratings,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    });
  }

  // Return all ratings summarized
  const all: Record<string, { ratingValue: number; reviewCount: number }> = {};
  for (const [key, data] of Object.entries(ratingsStore)) {
    all[key] = {
      ratingValue: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(1)) : 0,
      reviewCount: data.count,
    };
  }

  return NextResponse.json(all, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
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

    if (!ratingsStore[normalizedTool]) {
      ratingsStore[normalizedTool] = {
        sum: 0,
        count: 0,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    // Accumulate genuine vote
    ratingsStore[normalizedTool].sum += star;
    ratingsStore[normalizedTool].count += 1;
    ratingsStore[normalizedTool].ratings[star] = (ratingsStore[normalizedTool].ratings[star] || 0) + 1;

    saveRatingsToFile();

    const data = ratingsStore[normalizedTool];
    const ratingValue = parseFloat((data.sum / data.count).toFixed(1));

    return NextResponse.json({
      success: true,
      tool: normalizedTool,
      ratingValue,
      reviewCount: data.count,
      ratings: data.ratings,
    });
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
