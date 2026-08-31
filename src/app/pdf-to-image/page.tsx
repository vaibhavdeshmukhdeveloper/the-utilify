import { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PDF to Image Converter - Convert PDF to High-Res PNG or JPG Online Free | Utilify",
  description: "Convert PDF pages into high-resolution PNG or JPG graphics. Fast, secure in-memory conversion with zero permanent file storage.",
  alternates: {
    canonical: "/pdf-to-image",
  },
  openGraph: {
    title: "PDF to Image Converter - Free Online PDF to PNG/JPG | Utilify",
    description: "Convert PDF documents into high-density image files. Download individual pages or combined ZIP packages.",
    url: "https://www.theutilify.com/pdf-to-image",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Image Converter - High Resolution PNG/JPG | Utilify",
    description: "Convert PDF pages into crisp images instantly for free.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF to Image Converter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert PDF pages to high-quality images online. Easy, fast, secure, and completely free PDF to PNG or JPG conversion.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "High-DPI rendering for text and vector clarity",
      "Export to transparent PNG or compressed JPG",
      "Batch zip download for multi-page documents",
      "In-memory processing with zero hard disk storage"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <PdfToImageClient />
    </>
  );
}
