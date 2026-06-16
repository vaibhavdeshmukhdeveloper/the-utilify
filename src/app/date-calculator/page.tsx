import { Metadata } from "next";
import DateCalculatorClient from "./DateCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Date Calculator - Difference & Date Math | Utilify",
  description: "Calculate the duration between two dates (years, months, weeks, days) or add/subtract days, months, and years from any calendar date.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Date Calculator",
    "description": "Calculate the duration between two dates (years, months, weeks, days) or add/subtract days, months, and years from any calendar date.",
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
      <DateCalculatorClient />
    </>
  );
}
