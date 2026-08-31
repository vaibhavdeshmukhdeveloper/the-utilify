// scripts/ping-indexnow.mjs
const INDEXNOW_KEY = "8e4f1a293c7d4b6e8a0f2c4e6a8d0b2f";
const INDEXNOW_HOST = "www.theutilify.com";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

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
  "",
  "/about",
  "/blog",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/llms.txt",
];

const allPaths = [
  ...marketingPages,
  ...categoryHubs,
  ...comparisonPages,
  ...tools,
];

const urlList = allPaths.map(p => `https://${INDEXNOW_HOST}${p}`);

console.log(`[IndexNow] Submitting ${urlList.length} core URLs to IndexNow...`);

async function ping() {
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList,
      }),
    });

    console.log(`[IndexNow] Response status: ${res.status} (${res.statusText})`);
    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] ✅ Success! Search engines (Bing, Yandex, Seznam) notified successfully.`);
    } else {
      const text = await res.text();
      console.log(`[IndexNow] Response body:`, text);
    }
  } catch (err) {
    console.error(`[IndexNow] Error:`, err);
  }
}

ping();
