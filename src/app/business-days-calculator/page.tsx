import { Metadata } from "next";
import DateCalculatorClient from "../date-calculator/DateCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Business Days Calculator - Calculate Working Days Between Dates | Utilify",
  description: "Calculate business days, working days, and project milestones between two dates online for free. Exclude weekends and track project sprint turnaround windows.",
  alternates: {
    canonical: "/business-days-calculator",
  },
  openGraph: {
    title: "Business Days Calculator - Calculate Working Days Between Dates | Utilify",
    description: "Fast, accurate online business day and workday calculator. Compute project turnaround times and contractual notice periods in seconds.",
    url: "https://www.theutilify.com/business-days-calculator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Business Days Calculator - Workday Date Math | Utilify",
    description: "Calculate exact working days between two dates with zero weekends.",
  },
};

export default function BusinessDaysCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Business Days Calculator Online",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Calculate business days, working days, and project delivery deadlines between two dates online for free. Exclude weekends and manage SLAs.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Calculate exact business days and working days between any two dates",
      "Automatic 5-day workweek calculation excluding Saturdays and Sundays",
      "Calculate target deadline dates by adding or subtracting business days",
      "100% private client-side processing with shareable calculation URLs"
    ]
  };

  const customHowToUse = [
    { step: "Select Start Date", description: "Choose the kickoff date for your project sprint, legal notice, or contract." },
    { step: "Select End Date", description: "Select the deliverable completion date or milestone deadline." },
    { step: "View Working Days", description: "Instantly see the exact business days, completed workweeks, and elapsed calendar duration." },
  ];

  const customFaqs = [
    {
      question: "How are business days calculated?",
      answer: "Business days are calculated by taking the total elapsed calendar days between two dates and subtracting non-working weekend days (Saturdays and Sundays). For a standard 5-day workweek, every complete 7-day calendar week yields exactly 5 business days."
    },
    {
      question: "Why should I use working days instead of calendar days?",
      answer: "Sprint planning, enterprise service level agreements (SLAs), shipping estimates, and statutory legal filing deadlines measure operational time. Relying on calendar days overestimates team capacity by ~28% because weekends are non-operational."
    },
    {
      question: "Can I calculate a deadline by adding business days?",
      answer: "Yes! Switch to the 'Add / Subtract Days' tab, enter your baseline start date, and input the required working days duration to project the exact future deadline date."
    },
    {
      question: "Can I share my calculated project schedule with teammates?",
      answer: "Yes. Click 'Share Date Interval' to generate a persistent permalink containing your exact milestone dates ready to paste into Jira, Slack, or email."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <DateCalculatorClient
        initialTab="diff"
        customTitle="Business Days Calculator"
        customDescription="Calculate exact business days, working days, and project turnaround milestones between any two dates with zero weekends."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
