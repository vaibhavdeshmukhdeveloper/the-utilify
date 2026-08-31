import { Metadata } from "next";
import { CategoryHubLayout, CategoryToolItem, CategoryFaqItem } from "@/components/CategoryHubLayout";

export const metadata: Metadata = {
  title: "Free Financial Calculators & Math Tools Suite | Utilify",
  description: "Free financial and measurement calculators: SIP return calculator with Step-Up modeling, compound interest investment growth planner, BMI calculator, date/age calculators, and unit converters.",
  alternates: {
    canonical: "/category/financial-calculators",
  },
  openGraph: {
    title: "Free Financial Calculators & Math Tools Suite | Utilify",
    description: "Calculate SIP mutual fund returns, compound interest, BMI, exact age, and multi-unit conversions with interactive charts.",
    url: "https://www.theutilify.com/category/financial-calculators",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Financial & Measurement Calculators | Utilify",
    description: "Interactive compound interest calculators, SIP planners, BMI, and conversion tools.",
  },
};

const calcTools: CategoryToolItem[] = [
  {
    title: "SIP Calculator",
    description: "Estimate future mutual fund corpus growth with recurring monthly investments, expected annualized rates, and annual Step-Up top-ups.",
    href: "/sip-calculator",
    badge: "Finance",
    features: [
      "Step-Up annual increment calculation",
      "Interactive growth schedule charts",
      "Step-by-step KaTeX mathematical breakdown",
    ],
  },
  {
    title: "Investment Calculator",
    description: "Model long-term compound wealth growth combining initial lump-sum deposits with monthly additions and custom compounding frequencies.",
    href: "/investment-calculator",
    badge: "Wealth",
    features: [
      "Custom compounding intervals (annual, quarterly, monthly)",
      "Detailed annual breakdown schedule",
      "Total principal vs interest return metrics",
    ],
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI), ideal weight range, and WHO health categorization with Metric (kg/cm) and Imperial (lbs/ft) units.",
    href: "/bmi-calculator",
    badge: "Health",
    features: [
      "Metric & Imperial unit systems",
      "WHO health category classification",
      "Target healthy weight recommendations",
    ],
  },
  {
    title: "Age Calculator",
    description: "Calculate exact chronological age in years, months, weeks, days, and seconds, plus a live ticking countdown to your next birthday.",
    href: "/age-calculator",
    badge: "Utility",
    features: [
      "Exact breakdown down to hours & seconds",
      "Birthday milestone countdown",
      "Day of week born indicator",
    ],
  },
  {
    title: "Date Calculator",
    description: "Calculate the exact duration between two calendar dates or add/subtract business days, months, and years from any target date.",
    href: "/date-calculator",
    badge: "Productivity",
    features: [
      "Duration in days, weeks, months, years",
      "Business days vs weekend counts",
      "Add/subtract time dynamically",
    ],
  },
  {
    title: "Unit Converter",
    description: "Convert values across length, weight, temperature, area, volume, speed, and digital storage with high precision.",
    href: "/unit-converter",
    badge: "Math",
    features: [
      "Multi-dimension conversion (Length, Weight, Temp)",
      "Bidirectional real-time calculation",
      "High decimal precision",
    ],
  },
  {
    title: "Word Counter",
    description: "Count words, characters, sentences, paragraphs, and reading time in real-time with social media limit trackers.",
    href: "/word-counter",
    badge: "Text",
    features: [
      "Character counts (with/without spaces)",
      "Reading and speaking time estimation",
      "Live social media character limits",
    ],
  },
];

const calcFaqs: CategoryFaqItem[] = [
  {
    question: "How does the Step-Up SIP Calculator calculate compounding growth?",
    answer: "The Step-Up SIP recalculates your increased monthly investment annually (e.g. +10% each year matching salary appraisals) and applies monthly compound interest formulas to each cohort, dramatically accelerating final wealth.",
  },
  {
    question: "Are my personal financial inputs kept private?",
    answer: "Yes. All mathematical calculations execute 100% in your browser using client-side JavaScript. No numbers, balances, or financial scenarios are ever transmitted to or stored on our servers.",
  },
  {
    question: "Are these financial calculators suitable for retirement and goal planning?",
    answer: "Yes. Our calculators provide visual charts and step-by-step formula breakdowns ideal for planning retirement goals, college funds, mutual fund SIPs, and real estate down payments.",
  },
];

export default function FinancialCalculatorsCategoryPage() {
  return (
    <CategoryHubLayout
      categoryName="Financial Calculators &amp; Math Tools"
      categorySlug="financial-calculators"
      headline="Free Financial Calculators &amp; Math Suite"
      subheadline="Model compound interest, calculate SIP mutual fund returns, check BMI, and convert units with interactive visual charts."
      description="Calculate compound wealth, SIP mutual fund returns, BMI, dates, and unit conversions with free client-side interactive calculators."
      tools={calcTools}
      faqs={calcFaqs}
      detailedContent={
        <div>
          <h2>Precision Financial Modeling &amp; Daily Mathematical Utilities</h2>
          <p>
            Understanding compound growth is the single most important factor in long-term wealth creation. Our financial calculators provide transparent mathematical formulas, dynamic sliders, and compounding schedules to help you plan your financial independence.
          </p>
        </div>
      }
    />
  );
}
