import { Metadata } from "next";
import TextConverterClient from "./TextConverterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Text Case Converter - UPPERCASE, lowercase, Title & camelCase Online Free | Utilify",
  description: "Convert text cases online instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case. Fast and private.",
  alternates: {
    canonical: "/text-converter",
  },
  openGraph: {
    title: "Text Case Converter - Free Online Text Formatter | Utilify",
    description: "Convert between uppercase, lowercase, title case, camelCase, and snake_case instantly.",
    url: "https://www.theutilify.com/text-converter",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text Case Converter | Utilify",
    description: "Convert text into UPPER, lower, Title, camel, and snake case instantly.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Text Case Converter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert text formats instantly (UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case) and view detailed word and character counts.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1890",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Case conversions: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case",
      "One-click clipboard copy",
      "Instant real-time character and word count statistics",
      "100% browser-based text execution"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <TextConverterClient />
    </>
  );
}
