import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { SUPPORTED_LANGUAGES, toolTranslations } from "@/lib/i18n/translations";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.theutilify.com";

  // Stable release date for core tools & static marketing pages
  const staticReleaseDate = new Date("2026-08-28T00:00:00.000Z");

  const tools = [
    "/background-remover",
    "/image-compressor",
    "/color-palette",
    "/pdf-to-image",
    "/pdf-to-jpg",
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
    "/business-days-calculator",
    "/age-calculator",
    "/unit-converter",
    "/compress-png",
    "/compress-jpeg",
    "/compress-webp",
    "/make-signature-transparent",
    "/white-background-product-photos",
    "/fire-calculator",
    "/px-to-rem",
  ];

  const multilingualHubs = [
    "/es",
    "/pt",
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
    "/vs/smallpdf",
    "/vs/ezgif",
    "/vs/iloveimg",
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
    "/llms-full.txt",
  ];

  const marketingEntries: MetadataRoute.Sitemap = marketingPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticReleaseDate,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categoryHubs.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticReleaseDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const comparisonEntries: MetadataRoute.Sitemap = comparisonPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticReleaseDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticReleaseDate,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  const multilingualHubEntries: MetadataRoute.Sitemap = multilingualHubs.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: staticReleaseDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const localizedToolEntries: MetadataRoute.Sitemap = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    const toolsInLang = Object.keys(toolTranslations[lang]);
    for (const tool of toolsInLang) {
      localizedToolEntries.push({
        url: `${baseUrl}/${lang}/${tool}`,
        lastModified: staticReleaseDate,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...marketingEntries,
    ...categoryEntries,
    ...comparisonEntries,
    ...multilingualHubEntries,
    ...toolEntries,
    ...localizedToolEntries,
    ...blogEntries,
  ];
}
