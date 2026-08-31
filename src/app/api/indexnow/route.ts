import { NextRequest, NextResponse } from "next/server";
import { submitUrlsToIndexNow, submitAllPlatformUrls, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from "@/lib/indexnow";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // Ping all URLs on demand if action=submit-all
  if (action === "submit-all") {
    const result = await submitAllPlatformUrls();
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  }

  // Otherwise return status and key configuration
  return NextResponse.json({
    status: "active",
    protocol: "IndexNow",
    host: "www.theutilify.com",
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    usage: {
      submitSpecificUrls: "POST /api/indexnow with JSON { urls: ['https://www.theutilify.com/blog/example'] }",
      submitAllUrls: "GET /api/indexnow?action=submit-all",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const urls: string[] = body.urls || [];

    if (!Array.isArray(urls) || urls.length === 0) {
      // If empty array, default to submitting all platform URLs
      const result = await submitAllPlatformUrls();
      return NextResponse.json(result, { status: result.success ? 200 : 500 });
    }

    const result = await submitUrlsToIndexNow(urls);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || "Failed to process IndexNow request",
    }, { status: 500 });
  }
}
