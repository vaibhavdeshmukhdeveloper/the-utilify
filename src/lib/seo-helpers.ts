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
  ratingValue = "4.9",
  reviewCount = "2450",
}: ToolSchemaParams) {
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
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1",
    },
    "author": {
      "@type": "Organization",
      "name": "Utilify",
      "url": "https://www.theutilify.com",
    },
  };
}
