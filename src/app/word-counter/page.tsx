import { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free Online Word Counter - Live Character, Word & Reading Time Count | Utilify",
  description: "Count words, characters, sentences, paragraphs, and estimated reading time live. Track social media limits for X, LinkedIn, Instagram, and SEO meta tags for free.",
  alternates: {
    canonical: "/word-counter",
  },
  openGraph: {
    title: "Free Online Word & Character Counter | Utilify",
    description: "Live character and word counter with social media limit trackers and reading time estimates.",
    url: "https://www.theutilify.com/word-counter",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Word Counter | Utilify",
    description: "Real-time word, character, sentence, and social limit calculator.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Word & Character Counter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Count words, characters, sentences, paragraphs, reading time, and social media character limits in real-time.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time word, character (with and without spaces), sentence, and paragraph counts",
      "Estimated reading time and speaking time calculators",
      "Live social media character limits (X, LinkedIn, Meta description)",
      "100% private in-browser text analysis"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <WordCounterClient />
    </>
  );
}
