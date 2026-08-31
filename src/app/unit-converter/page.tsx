import { Metadata } from "next";
import UnitConverterClient from "./UnitConverterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Unit Converter - Length, Weight, Area, Volume & Temperature Online Free | Utilify",
  description: "Convert units of measurement instantly: metric to imperial, length, weight, area, volume, and temperature with high decimal precision.",
  alternates: {
    canonical: "/unit-converter",
  },
  openGraph: {
    title: "Unit Converter - Free Measurement Converter | Utilify",
    description: "Convert length, weight, temperature, area, and volume units in your browser with zero latency.",
    url: "https://www.theutilify.com/unit-converter",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Unit Converter | Utilify",
    description: "Instant unit converter for metric and imperial measurement systems.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Unit Converter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Easily convert units for length, weight, temperature, area, and volume with our instant, client-side utility converter.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "3620",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Converts Length (km, m, cm, mm, mi, yd, ft, in)",
      "Converts Weight (kg, g, mg, lb, oz, ton)",
      "Converts Temperature (Celsius, Fahrenheit, Kelvin)",
      "Converts Area & Volume with real-time bidirectional calculations"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <UnitConverterClient />
    </>
  );
}
