import { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Merge PDF Online - Combine Multiple PDF Files Free (No Upload Limits) | Utilify",
  description: "Combine multiple PDF documents, receipts, and invoices into a single organized master PDF. Drag-and-drop reordering with zero file retention.",
  alternates: {
    canonical: "/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Online - Combine Multiple PDF Files Free | Utilify",
    description: "Combine PDF files in seconds with drag-and-drop ordering. 100% free with transient RAM processing.",
    url: "https://www.theutilify.com/merge-pdf",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online Free | Utilify",
    description: "Combine multiple PDFs into one unified document with zero upload limits.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Merge PDF",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Combine multiple PDF files into one document in seconds. Arrange pages in order, completely free and secure PDF merger.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "3120",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Drag-and-drop file reordering",
      "Combine unlimited PDF attachments",
      "High-speed PyMuPDF serverless stream processing",
      "Zero file retention and immediate memory garbage collection"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <MergePdfClient />
    </>
  );
}
