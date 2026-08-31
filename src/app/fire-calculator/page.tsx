import { Metadata } from "next";
import FireCalculatorClient from "./FireCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FIRE Calculator - Financial Independence Retire Early & 4% Rule | Utilify",
  description: "Calculate your Financial Independence Retire Early (FIRE) number, annual retirement spending target, and portfolio milestone years using the 4% safe withdrawal rule.",
  alternates: {
    canonical: "/fire-calculator",
  },
  openGraph: {
    title: "FIRE Calculator - Financial Independence & 4% Rule | Utilify",
    description: "Calculate your target FIRE number and retirement timeline with inflation-adjusted compounding math.",
    url: "https://www.theutilify.com/fire-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free FIRE Calculator - 4% Rule | Utilify",
    description: "Model your Financial Independence target number and years to early retirement.",
  },
};

export default function FireCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FIRE Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate your Financial Independence Retire Early (FIRE) number, annual spending targets, and milestone years using the 4% safe withdrawal rule.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "4% Trinity Study Safe Withdrawal Rate calculation",
      "Lean FIRE, Standard FIRE, and Fat FIRE target tiers",
      "Inflation-adjusted real compounding growth simulation",
      "LaTeX mathematical proofs and interactive visual sliders"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <FireCalculatorClient />
    </>
  );
}
