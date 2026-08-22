import { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Split PDF Online - Extract Pages from PDF for Free (No Limit) | Utilify",
  description: "Extract specific pages or custom page ranges from your PDF files online. Fast, secure, in-memory processing with zero file storage.",
  alternates: {
    canonical: "/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online - Extract Pages from PDF for Free | Utilify",
    description: "Extract pages and split PDF files in seconds. 100% free with zero file retention.",
    url: "https://www.theutilify.com/split-pdf",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online Free | Utilify",
    description: "Extract specific pages and ranges from PDF documents instantly.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Split PDF",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Split PDF files and extract specific pages or ranges. Fast, secure, and 100% free online PDF splitter tool.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Custom page range extraction (e.g. 1-3, 5, 8-10)",
      "Single-page and multi-page range splitting",
      "Instant in-memory generation with zero disk storage",
      "No account or email required"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <SplitPdfClient />
    </>
  );
}
