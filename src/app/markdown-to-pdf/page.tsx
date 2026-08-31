import { Metadata } from "next";
import MarkdownToPdfClient from "./MarkdownToPdfClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter - Clean Styling & Code Highlighting Online | Utilify",
  description: "Convert Markdown documents into beautiful, print-ready PDF files with custom typography, syntax highlighting, and live split-screen preview.",
  alternates: {
    canonical: "/markdown-to-pdf",
  },
  openGraph: {
    title: "Markdown to PDF Converter - Free Online Editor & Compiler | Utilify",
    description: "Compile Markdown to styled PDF documents in seconds. Custom themes, margins, and code highlighting.",
    url: "https://www.theutilify.com/markdown-to-pdf",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to PDF Converter | Utilify",
    description: "Compile Markdown text into professional print-ready PDFs instantly.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Markdown to PDF Converter",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert Markdown documents or raw MD text into beautiful, styled PDF files. Features live editor, preview, and CSS styles.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Live split-screen Markdown editor and preview",
      "Syntax highlighting for code blocks",
      "Print-optimized PDF page margins and typography",
      "Zero server tracking"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <MarkdownToPdfClient />
    </>
  );
}
