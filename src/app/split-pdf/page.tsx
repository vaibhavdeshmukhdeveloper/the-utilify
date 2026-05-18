import { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Split PDF - Extract Pages from PDF Online | Utilify",
  description: "Split PDF files and extract specific pages or ranges. Fast, secure, and 100% free online PDF splitter tool.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Split PDF",
    "description": "Split PDF files and extract specific pages or ranges. Fast, secure, and 100% free online PDF splitter tool.",
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
      <SplitPdfClient />
    </>
  );
}
