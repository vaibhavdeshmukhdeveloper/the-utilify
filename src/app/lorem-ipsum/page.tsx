import { Metadata } from "next";
import LoremIpsumClient from "./LoremIpsumClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text | Utilify",
  description: "Create customizable placeholder text (paragraphs, sentences, words, lists) for your designs and code, and copy formatted HTML results.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Lorem Ipsum Generator",
    "description": "Create customizable placeholder text (paragraphs, sentences, words, lists) for your designs and code, and copy formatted HTML results.",
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
      <LoremIpsumClient />
    </>
  );
}
