import { Metadata } from "next";
import DiffCheckerClient from "./DiffCheckerClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Diff Checker - Compare Text & Code Differences Side-by-Side Free | Utilify",
  description: "Compare two pieces of text, code, or JSON side-by-side. Highlight added, removed, and modified characters and lines instantly with zero server storage.",
  alternates: {
    canonical: "/diff-checker",
  },
  openGraph: {
    title: "Diff Checker - Free Side-by-Side Text Comparison | Utilify",
    description: "Compare text and code with split and unified diff views. 100% private in-browser tool.",
    url: "https://www.theutilify.com/diff-checker",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Diff Checker | Utilify",
    description: "Compare text and code differences with visual side-by-side highlighting.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Diff Checker",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Compare two pieces of text side-by-side or inline to instantly highlight additions, deletions, and line modifications with absolute privacy.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Side-by-side split view and unified inline view",
      "Character-level and line-level difference highlighting",
      "Added / removed lines counter statistics",
      "100% client-side text processing"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <DiffCheckerClient />
    </>
  );
}
