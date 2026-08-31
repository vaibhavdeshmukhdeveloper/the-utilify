import { Metadata } from "next";
import BmiCalculatorClient from "./BmiCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "BMI Calculator - Free Body Mass Index & Healthy Weight Calculator | Utilify",
  description: "Calculate your exact Body Mass Index (BMI), ideal weight range, and WHO health category instantly with Metric and Imperial units.",
  alternates: {
    canonical: "/bmi-calculator",
  },
  openGraph: {
    title: "BMI Calculator - Free Body Mass Index Calculator | Utilify",
    description: "Instant BMI check with WHO health category classifications and prime weight ranges.",
    url: "https://www.theutilify.com/bmi-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BMI Calculator | Utilify",
    description: "Calculate your Body Mass Index and healthy weight range instantly.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BMI Calculator",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate your Body Mass Index (BMI) easily with our free online calculator. Get personalized health classification and healthy weight ranges.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2640",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Metric (cm/kg) and Imperial (ft/in/lbs) unit toggles",
      "WHO standard adult BMI category classification",
      "Calculates ideal weight target range",
      "100% private in-browser computation"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <BmiCalculatorClient />
    </>
  );
}
