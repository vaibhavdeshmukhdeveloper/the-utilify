import { Metadata } from "next";
import AgeCalculatorClient from "./AgeCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Age Calculator - Exact Age, Chronological Days & Birthday Countdown | Utilify",
  description: "Calculate your precise chronological age in years, months, days, hours, and minutes, plus an accurate live countdown to your next birthday.",
  alternates: {
    canonical: "/age-calculator",
  },
  openGraph: {
    title: "Age Calculator - Exact Age & Birthday Countdown | Utilify",
    description: "Calculate your exact age and track upcoming milestones and birthday countdowns.",
    url: "https://www.theutilify.com/age-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Age Calculator | Utilify",
    description: "Calculate your exact chronological age and next birthday countdown.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Age Calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate your exact age in years, months, weeks, and days, and track the live countdown in seconds until your next birthday.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Exact age breakdown in years, months, weeks, days, hours, minutes, and seconds",
      "Live ticking countdown to next upcoming birthday",
      "Day of the week born indicator",
      "100% private in-browser computation"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <AgeCalculatorClient />
    </>
  );
}
