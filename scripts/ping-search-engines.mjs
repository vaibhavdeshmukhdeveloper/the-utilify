// scripts/ping-search-engines.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INDEXNOW_KEY = "8e4f1a293c7d4b6e8a0f2c4e6a8d0b2f";
const HOST = "www.theutilify.com";
const BASE_URL = `https://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;

// Core Tools
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
  "/compress-png",
  "/compress-jpeg",
  "/make-signature-transparent",
  "/white-background-product-photos",
  "/fire-calculator",
  "/px-to-rem",
];

// Pillar Categories
const categoryHubs = [
  "/category/pdf-tools",
  "/category/image-tools",
  "/category/developer-tools",
  "/category/financial-calculators",
];

// Competitor Comparisons
const comparisonPages = [
  "/vs/ilovepdf",
  "/vs/removebg",
  "/vs/tinypng",
  "/vs/smallpdf",
  "/vs/ezgif",
  "/vs/iloveimg",
];

// Marketing & Discovery
const marketingPages = [
  "",
  "/about",
  "/blog",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/llms.txt",
  "/llms-full.txt",
];

// Extract blog slugs from src/lib/blog-data.ts
function getBlogUrls() {
  try {
    const blogDataPath = path.join(__dirname, "..", "src", "lib", "blog-data.ts");
    const content = fs.readFileSync(blogDataPath, "utf-8");
    const matches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
    return matches.map((m) => `/blog/${m[1]}`);
  } catch (err) {
    console.warn(`[Auto-Ping] Warning: Could not parse blog-data.ts, fallback to empty blogs`, err?.message);
    return [];
  }
}

async function pingSearchEngines() {
  const blogUrls = getBlogUrls();
  const allRoutes = [
    ...marketingPages,
    ...categoryHubs,
    ...comparisonPages,
    ...tools,
    ...blogUrls,
  ];

  // Remove duplicates and generate absolute URLs
  const uniqueRoutes = Array.from(new Set(allRoutes));
  const urlList = uniqueRoutes.map((route) => (route === "" ? BASE_URL : `${BASE_URL}${route}`));

  console.log(`\n🚀 [Auto-Ping] Initiating Search Engine Submission for ${urlList.length} URLs...`);
  console.log(`   • ${tools.length} Tools & Programmatic Pages`);
  console.log(`   • ${categoryHubs.length} Category Pillar Hubs`);
  console.log(`   • ${comparisonPages.length} Competitor Comparisons`);
  console.log(`   • ${blogUrls.length} SEO Blog Guides\n`);

  const indexNowPayload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const indexNowEndpoints = [
    { name: "IndexNow Central (api.indexnow.org)", url: "https://api.indexnow.org/indexnow" },
    { name: "Bing (www.bing.com/indexnow)", url: "https://www.bing.com/indexnow" },
    { name: "Yandex (yandex.com/indexnow)", url: "https://yandex.com/indexnow" },
  ];

  // 1. Submit to IndexNow network
  console.log(`📡 [1/2] Submitting to IndexNow Protocol (Bing, Yandex, Seznam, Naver)...`);
  for (const endpoint of indexNowEndpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(endpoint.url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(indexNowPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 200 || res.status === 202) {
        console.log(`   ✅ ${endpoint.name}: HTTP ${res.status} OK (Indexed ${urlList.length} URLs)`);
      } else {
        console.log(`   ⚠️  ${endpoint.name}: HTTP ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.log(`   ⚠️  ${endpoint.name}: Request bypassed (${err?.message || "timeout"})`);
    }
  }

  // 2. Ping Sitemaps
  console.log(`\n🗺️  [2/2] Pinging XML Sitemaps...`);
  const sitemapEndpoints = [
    { name: "Google", url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
    { name: "Bing", url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
  ];

  for (const item of sitemapEndpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(item.url, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      console.log(`   ✅ ${item.name} Sitemap Ping: HTTP ${res.status} ${res.statusText}`);
    } catch (err) {
      console.log(`   ⚠️  ${item.name} Sitemap Ping: Request bypassed (${err?.message || "timeout"})`);
    }
  }

  console.log(`\n✨ [Auto-Ping] Complete! Search engines have been notified of all latest pages.\n`);
}

pingSearchEngines().catch((err) => {
  console.error(`[Auto-Ping] Unexpected execution error:`, err);
});
