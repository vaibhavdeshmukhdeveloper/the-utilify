import { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Merge PDF - Combine Multiple PDF Files Online | Utilify",
  description: "Combine multiple PDF files into one document in seconds. Arrange pages in order, completely free and secure PDF merger.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Merge PDF",
    "description": "Combine multiple PDF files into one document in seconds. Arrange pages in order, completely free and secure PDF merger.",
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
      <MergePdfClient />
    </>
  );
}
