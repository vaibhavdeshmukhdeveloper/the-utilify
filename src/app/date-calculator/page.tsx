import { Metadata } from "next";
import DateCalculatorClient from "./DateCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Date Calculator - Days Between Dates & Calendar Math Free | Utilify",
  description: "Calculate exact duration between two dates in years, months, weeks, and days, or add/subtract time from any calendar date. Free and instant.",
  alternates: {
    canonical: "/date-calculator",
  },
  openGraph: {
    title: "Date Calculator - Difference & Date Math Online | Utilify",
    description: "Calculate duration between dates or add and subtract calendar days.",
    url: "https://www.theutilify.com/date-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Date Calculator | Utilify",
    description: "Calculate days between dates and calendar math in seconds.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Date Calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate the duration between two dates (years, months, weeks, days) or add/subtract days, months, and years from any calendar date.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1920",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Calculates days, weeks, months, and years between two dates",
      "Add or subtract days, weeks, months, or years from a starting date",
      "Business days and weekend duration breakdown",
      "100% private in-browser calendar calculations"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <DateCalculatorClient />
    </>
  );
}
