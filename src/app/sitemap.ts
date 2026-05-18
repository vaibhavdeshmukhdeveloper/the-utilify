import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://utilify.io"; // Brand domain

  const tools = [
    "/json-formatter",
    "/bmi-calculator",
    "/investment-calculator",
    "/sip-calculator",
    "/pdf-to-image",
    "/split-pdf",
    "/merge-pdf",
    "/background-remover",
    "/image-compressor",
    "/markdown-to-pdf",
  ];

  const marketingPages = [
    "",
    "/about",
    "/blog",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const blogSlugs = [
    "/blog/stop-using-cluttered-online-converters",
    "/blog/demystifying-compound-interest-wealth-creation",
    "/blog/ai-background-removal-tips-for-ecommerce",
  ];

  const allPaths = [...marketingPages, ...tools, ...blogSlugs];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path.includes("/blog/") ? 0.6 : 0.8,
  }));
}
