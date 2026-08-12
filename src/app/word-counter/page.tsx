import { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Free Online Word Counter - Live Character, Word & Sentence Count | Utilify",
  description: "Count words, characters, sentences, paragraphs, and reading time in real-time. Track social media character limits for X, LinkedIn, Instagram, and SEO meta tags 100% free.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Word & Character Counter",
    "description": "Count words, characters, sentences, paragraphs, reading time, and social media character limits in real-time.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <WordCounterClient />
    </>
  );
}
