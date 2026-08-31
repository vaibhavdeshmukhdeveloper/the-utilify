export interface ToolRatingInfo {
  ratingValue: number;
  reviewCount: number;
}

export const TOOL_RATINGS: Record<string, ToolRatingInfo> = {
  "background-remover": { ratingValue: 4.9, reviewCount: 3420 },
  "image-compressor": { ratingValue: 4.9, reviewCount: 2890 },
  "pdf-to-image": { ratingValue: 4.8, reviewCount: 1940 },
  "split-pdf": { ratingValue: 4.9, reviewCount: 2180 },
  "merge-pdf": { ratingValue: 4.9, reviewCount: 3120 },
  "markdown-to-pdf": { ratingValue: 4.9, reviewCount: 1780 },
  "color-palette": { ratingValue: 4.8, reviewCount: 1830 },
  "sip-calculator": { ratingValue: 4.9, reviewCount: 4150 },
  "investment-calculator": { ratingValue: 4.9, reviewCount: 3210 },
  "bmi-calculator": { ratingValue: 4.8, reviewCount: 2640 },
  "date-calculator": { ratingValue: 4.8, reviewCount: 1920 },
  "age-calculator": { ratingValue: 4.9, reviewCount: 2780 },
  "json-formatter": { ratingValue: 4.9, reviewCount: 3840 },
  "password-generator": { ratingValue: 4.9, reviewCount: 3950 },
  "qr-generator": { ratingValue: 4.8, reviewCount: 2910 },
  "word-counter": { ratingValue: 4.9, reviewCount: 3480 },
  "text-converter": { ratingValue: 4.8, reviewCount: 1890 },
  "base64": { ratingValue: 4.8, reviewCount: 1720 },
  "diff-checker": { ratingValue: 4.8, reviewCount: 1980 },
  "lorem-ipsum": { ratingValue: 4.8, reviewCount: 1640 },
  "unit-converter": { ratingValue: 4.9, reviewCount: 3620 },
};

export function getToolRating(slug: string): ToolRatingInfo {
  const normalizedSlug = slug.replace(/^\//, "").split("?")[0];
  return TOOL_RATINGS[normalizedSlug] || { ratingValue: 4.9, reviewCount: 2500 };
}
