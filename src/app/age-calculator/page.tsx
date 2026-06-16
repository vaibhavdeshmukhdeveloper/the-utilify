import { Metadata } from "next";
import AgeCalculatorClient from "./AgeCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Age Calculator - Exact Age & Birthday Countdown | Utilify",
  description: "Calculate your exact age in years, months, weeks, and days, and track the live countdown in seconds until your next birthday.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Age Calculator",
    "description": "Calculate your exact age in years, months, weeks, and days, and track the live countdown in seconds until your next birthday.",
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
      <AgeCalculatorClient />
    </>
  );
}
