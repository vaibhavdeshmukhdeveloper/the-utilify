import { blogPosts } from "./blog-data";

export const INDEXNOW_KEY = "8e4f1a293c7d4b6e8a0f2c4e6a8d0b2f";
export const INDEXNOW_HOST = "www.theutilify.com";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResponse {
  success: boolean;
  status: number;
  message: string;
  submittedCount: number;
  urls: string[];
}

/**
 * Submits a list of URLs to the IndexNow API to instantly trigger indexing across Bing, Yandex, Seznam, Naver.
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  if (!urls || urls.length === 0) {
    return {
      success: false,
      status: 400,
      message: "No URLs provided for IndexNow submission",
      submittedCount: 0,
      urls: [],
    };
  }

  // Ensure full canonical URLs
  const formattedUrls = urls.map((u) =>
    u.startsWith("http") ? u : `https://${INDEXNOW_HOST}${u.startsWith("/") ? u : `/${u}`}`
  );

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: formattedUrls,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // 200 = OK, 202 = Accepted
    const isSuccess = res.status === 200 || res.status === 202;
    const responseText = await res.text().catch(() => "");

    return {
      success: isSuccess,
      status: res.status,
      message: isSuccess
        ? `Successfully submitted ${formattedUrls.length} URLs to IndexNow network (Bing, Yandex, Seznam).`
        : `IndexNow returned status ${res.status}: ${responseText || "Submission issue"}`,
      submittedCount: formattedUrls.length,
      urls: formattedUrls,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message: `IndexNow connection failed: ${error?.message || "Network error"}`,
      submittedCount: 0,
      urls: formattedUrls,
    };
  }
}

/**
 * Collects all platform URLs (tools, categories, comparisons, blogs) and submits to IndexNow.
 */
export async function submitAllPlatformUrls(): Promise<IndexNowResponse> {
  const tools = [
    "/background-remover",
    "/image-compressor",
    "/color-palette",
    "/pdf-to-image",
    "/split-pdf",
    "/merge-pdf",
    "/markdown-to-pdf",
    "/sip-calculator",
    "/investment-calculator",
    "/bmi-calculator",
    "/json-formatter",
    "/password-generator",
    "/qr-generator",
    "/word-counter",
    "/text-converter",
    "/base64",
    "/diff-checker",
    "/lorem-ipsum",
    "/date-calculator",
    "/age-calculator",
    "/unit-converter",
  ];

  const categoryHubs = [
    "/category/pdf-tools",
    "/category/image-tools",
    "/category/developer-tools",
    "/category/financial-calculators",
  ];

  const comparisonPages = [
    "/vs/ilovepdf",
    "/vs/removebg",
    "/vs/tinypng",
  ];

  const marketingPages = [
    "/",
    "/about",
    "/blog",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/llms.txt",
  ];

  const blogUrls = blogPosts.map((p) => `/blog/${p.slug}`);

  const allUrls = [
    ...marketingPages,
    ...categoryHubs,
    ...comparisonPages,
    ...tools,
    ...blogUrls,
  ];

  return submitUrlsToIndexNow(allUrls);
}
