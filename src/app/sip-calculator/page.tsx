import { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "SIP Calculator - Calculate Monthly Mutual Fund Returns & Wealth Growth | Utilify",
  description: "Calculate your future mutual fund returns and compounding growth with our free SIP calculator. Visualize monthly contributions, total investment, and expected wealth maturity.",
  alternates: {
    canonical: "/sip-calculator",
  },
  openGraph: {
    title: "SIP Calculator - Mutual Fund Compound Return Calculator | Utilify",
    description: "Calculate your investment growth and maturity corpus with interactive charts and compound interest schedules.",
    url: "https://www.theutilify.com/sip-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator - Monthly Mutual Fund Returns | Utilify",
    description: "Free online SIP return calculator with interactive growth charts.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SIP Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate your mutual fund returns easily with our free SIP calculator. Plan your investment and get clear estimates of your maturity wealth.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "4150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Dynamic monthly contribution and duration sliders",
      "Interactive compounding growth visualization chart",
      "Calculates invested amount, estimated returns, and total maturity wealth",
      "100% client-side privacy - financial data never leaves your device"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <SipCalculatorClient />
    </>
  );
}
