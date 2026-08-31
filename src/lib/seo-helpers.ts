export interface ToolSchemaParams {
  name: string;
  description: string;
  applicationCategory?: string;
  slug: string;
  ratingValue?: string | number;
  reviewCount?: string | number;
}

export function getSoftwareAppSchema({
  name,
  description,
  applicationCategory = "UtilityApplication",
  slug,
  ratingValue,
  reviewCount,
}: ToolSchemaParams) {
  const schema: any = {
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
    "author": {
      "@type": "Organization",
      "name": "The Utilify Editorial Team",
      "url": "https://www.theutilify.com/about",
    },
  };

  const countNum = typeof reviewCount === "string" ? parseInt(reviewCount, 10) : (reviewCount || 0);
  const valNum = typeof ratingValue === "string" ? parseFloat(ratingValue) : (ratingValue || 0);

  // Only include aggregateRating when authentic positive review count exists
  if (countNum > 0 && valNum > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": valNum.toFixed(1),
      "reviewCount": countNum.toString(),
      "bestRating": "5",
      "worstRating": "1",
    };
  }

  return schema;
}
