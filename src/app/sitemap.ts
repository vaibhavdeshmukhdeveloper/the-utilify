import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.theutilify.com";

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
    "/password-generator",
    "/qr-generator",
    "/text-converter",
    "/word-counter",
    "/base64",
    "/color-palette",
    "/date-calculator",
    "/age-calculator",
    "/unit-converter",
    "/diff-checker",
    "/lorem-ipsum",
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

  const blogSlugs = blogPosts.map((post) => `/blog/${post.slug}`);

  // High-value canonical routes submitted to Google Search Console
  const allPaths = [...marketingPages, ...tools, ...blogSlugs];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path.includes("/blog/") ? 0.7 : 0.9,
  }));
}
