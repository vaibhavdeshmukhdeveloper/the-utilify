import { Metadata } from "next";
import InvestmentCalculatorClient from "./InvestmentCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Investment Calculator - Compound Interest & Growth Planner | Utilify",
  description: "Estimate your future wealth and compound interest growth with our free investment calculator. Plan monthly contributions and initial capital.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Investment Calculator",
    "description": "Estimate your future wealth and compound interest growth with our free investment calculator. Plan monthly contributions and initial capital.",
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
      <InvestmentCalculatorClient />
    </>
  );
}
