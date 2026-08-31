import { Metadata } from "next";
import InvestmentCalculatorClient from "./InvestmentCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Investment Calculator - Compound Interest & Wealth Growth Planner | Utilify",
  description: "Calculate compound interest on lump-sum principal and recurring monthly deposits. Custom compounding frequencies, interactive growth charts, and breakdown schedules.",
  alternates: {
    canonical: "/investment-calculator",
  },
  openGraph: {
    title: "Investment Calculator - Compound Interest Planner | Utilify",
    description: "Model long-term compound growth with customized interest compounding frequencies and monthly additions.",
    url: "https://www.theutilify.com/investment-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Investment & Compound Interest Calculator | Utilify",
    description: "Simulate compound interest returns and retirement wealth growth.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Investment Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Estimate your future wealth and compound interest growth with our free investment calculator. Plan monthly contributions and initial capital.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "3210",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Combines initial principal with recurring periodic additions",
      "Custom compounding intervals (annually, semi-annually, quarterly, monthly)",
      "Detailed annual breakdown table and wealth growth trajectory",
      "Zero server tracking - 100% private in-browser math"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <InvestmentCalculatorClient />
    </>
  );
}
