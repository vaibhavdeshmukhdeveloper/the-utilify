import { Metadata } from "next";
import JsonFormatterClient from "./JsonFormatterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Clean, Prettify & Minify Online | Utilify",
  description: "Free online JSON formatter, prettifier, and syntax validator. Clean nested JSON structures, fix syntax errors with line numbers, and minify payloads locally.",
  alternates: {
    canonical: "/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator - Free Online Developer Tool | Utilify",
    description: "Format, validate, prettify, and minify JSON data instantly. 100% private in-browser parsing.",
    url: "https://www.theutilify.com/json-formatter",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter & Validator | Utilify",
    description: "Prettify and debug malformed JSON in your browser with zero latency.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JSON Formatter & Validator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Free online JSON formatter and validator to clean, format, validate, and minify your JSON data. Clean syntax errors instantly.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "3840",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Custom indentation (2 spaces, 4 spaces, tabs)",
      "Instant syntax error detection with line and column highlighting",
      "One-click minify / compress payload",
      "100% client-side privacy - sensitive API keys never hit a server"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonFormatterClient />
    </>
  );
}
