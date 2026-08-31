import { Metadata } from "next";
import Base64Client from "./Base64Client";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Convert Strings & Files Online Free | Utilify",
  description: "Encode text and files to Base64 data strings, or decode Base64 back to raw text and binary files instantly. 100% private in-browser decoding.",
  alternates: {
    canonical: "/base64",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder - Free Online Tool | Utilify",
    description: "Encode and decode Base64 text and files securely in your browser.",
    url: "https://www.theutilify.com/base64",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Base64 Encoder & Decoder | Utilify",
    description: "Fast, client-side Base64 string and file encoding tool.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Base64 Encoder & Decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Encode plain text or upload binary files to Base64 format, and decode Base64 strings back to text or files instantly and securely.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1720",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Bidirectional text encoding and decoding (UTF-8 supported)",
      "File-to-Base64 and Base64-to-File converter",
      "One-click copy and clean error feedback",
      "Zero server transmission"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <Base64Client />
    </>
  );
}
