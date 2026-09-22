import { Metadata } from "next";
import InvestmentCalculatorClient from "./InvestmentCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Investment Calculator - Multi-Target Compound Growth & Wealth Planner | Utilify",
  description: "Free multi-target investment calculator: calculate End Amount, Additional Contributions, Starting Capital, Return Rate, or Investment Length. Interactive charts and yearly breakdown.",
  alternates: {
    canonical: "/investment-calculator",
  },
  openGraph: {
    title: "Investment Calculator - 5-in-1 Wealth & Compound Growth Planner | Utilify",
    description: "Calculate future wealth, required monthly savings, initial principal, annualized return rate, or investment horizon with customizable compounding intervals.",
    url: "https://www.theutilify.com/investment-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Investment & Compound Growth Calculator | Utilify",
    description: "Calculate end balance, required savings, starting capital, return rate, or time horizon.",
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
    "description": "Comprehensive investment calculator solving for 5 financial goals: Future Wealth, Periodic Contributions, Initial Principal, Return Rate, and Investment Length.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "5 flexible calculation targets: End Amount, Additional Contribution, Starting Amount, Return Rate, and Invest Length",
      "Custom compounding intervals: daily, monthly, quarterly, semiannually, and annually",
      "Beginning and end of period contribution timing with monthly and annual deposit options",
      "Interactive donut asset distribution and cumulative wealth growth trajectory charts",
      "Detailed annual accumulation schedule with instant CSV export and shareable links",
      "Zero server tracking - 100% private in-browser financial mathematics"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <InvestmentCalculatorClient />
    </>
  );
}
