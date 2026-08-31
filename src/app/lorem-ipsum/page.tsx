import { Metadata } from "next";
import LoremIpsumClient from "./LoremIpsumClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Dummy & Placeholder Text Generator Online | Utilify",
  description: "Generate customized dummy placeholder text in paragraphs, sentences, words, or lists. One-click plain text and HTML tag formatting copy.",
  alternates: {
    canonical: "/lorem-ipsum",
  },
  openGraph: {
    title: "Lorem Ipsum Generator - Free Placeholder Text Generator | Utilify",
    description: "Generate mock copy in words, sentences, or paragraphs with HTML formatting.",
    url: "https://www.theutilify.com/lorem-ipsum",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Lorem Ipsum Generator | Utilify",
    description: "Create customized placeholder dummy text for mockups and UI designs.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Lorem Ipsum Generator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Create customizable placeholder text (paragraphs, sentences, words, lists) for your designs and code, and copy formatted HTML results.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1640",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Custom count for paragraphs, sentences, words, and list items",
      "HTML tag wrapping toggle (<p>, <li>)",
      "Optional standard 'Lorem ipsum dolor sit amet' prefix",
      "Instant one-click clipboard copy"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <LoremIpsumClient />
    </>
  );
}
