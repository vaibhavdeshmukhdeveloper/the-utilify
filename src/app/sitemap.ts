import { MetadataRoute } from "next";
import { useCases } from "@/lib/use-cases-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.theutilify.com"; // Correct active brand domain

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

  // Dynamic programmatic SEO routes
  const useCasePaths = useCases.map((uc) => `/use-case/${uc.slug}`);

  const allPaths = [...marketingPages, ...tools, ...blogSlugs, ...useCasePaths];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path.includes("/use-case/") ? 0.7 : path.includes("/blog/") ? 0.6 : 0.8,
  }));
}
