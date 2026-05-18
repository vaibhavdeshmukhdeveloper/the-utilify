import { Metadata } from "next";
import MarkdownToPdfClient from "./MarkdownToPdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter - Free Online Markdown Editor | Utilify",
  description: "Convert Markdown documents or raw MD text into beautiful, styled PDF files. Features live editor, preview, and CSS styles.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Markdown to PDF Converter",
    "description": "Convert Markdown documents or raw MD text into beautiful, styled PDF files. Features live editor, preview, and CSS styles.",
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
      <MarkdownToPdfClient />
    </>
  );
}
