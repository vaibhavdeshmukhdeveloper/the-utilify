import { getToolRating } from "./rating-data";

export interface ToolSchemaParams {
  name: string;
  description: string;
  applicationCategory?: string;
  slug: string;
  ratingValue?: string;
  reviewCount?: string;
}

export function getSoftwareAppSchema({
  name,
  description,
  applicationCategory = "UtilityApplication",
  slug,
  ratingValue,
  reviewCount,
}: ToolSchemaParams) {
  const defaultRating = getToolRating(slug);
  const finalRatingValue = ratingValue || defaultRating.ratingValue.toString();
  const finalReviewCount = reviewCount || defaultRating.reviewCount.toString();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": applicationCategory,
    "operatingSystem": "All",
    "url": `https://www.theutilify.com/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": finalRatingValue,
      "reviewCount": finalReviewCount,
      "bestRating": "5",
      "worstRating": "1",
    },
    "author": {
      "@type": "Organization",
      "name": "The Utilify Editorial Team",
      "url": "https://www.theutilify.com/about",
    },
  };
}

