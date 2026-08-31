import { Metadata } from "next";
import ImageCompressorClient from "../image-compressor/ImageCompressorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Compress JPEG Online - Shrink JPG File Size Without Quality Loss | Utilify",
  description: "Reduce JPG/JPEG image file sizes by up to 85% for websites, Shopify stores, and email attachments. 100% private in-browser compression.",
  alternates: {
    canonical: "/compress-jpeg",
  },
  openGraph: {
    title: "Compress JPEG Online - Free JPG File Shrinker | Utilify",
    description: "Shrink JPEG photos while maintaining sharp photographic detail and colors. Fast browser-based JPEG optimizer.",
    url: "https://www.theutilify.com/compress-jpeg",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JPEG Compressor - Fast & Lossless | Utilify",
    description: "Reduce JPG photo file sizes by up to 85% with zero server uploads.",
  },
};

export default function CompressJpegPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Compress JPEG Online",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Reduce JPG image file sizes by up to 85% for websites and email attachments without losing visual clarity.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossy JPEG quantization with perceptual quality control",
      "Reduces photographic asset weight for Core Web Vitals (LCP)",
      "Batch parallel processing up to 20 images",
      "Zero server uploads - 100% private in-browser compression"
    ]
  };

  const customHowToUse = [
    { step: "Upload JPG / JPEG Photos", description: "Select single or multiple camera photos or product shots up to 25MB." },
    { step: "Select Quality Level", description: "Set the compression slider between 70% and 85% for optimal size and clarity." },
    { step: "Download Compressed JPGs", description: "Download optimized JPG images individually or export everything in a ZIP file." },
  ];

  const customFaqs = [
    {
      question: "How do I compress a JPEG to under 50KB or 100KB?",
      answer: "Set the quality slider between 60% and 75%. Most 2MB–5MB JPEG photos easily shrink down to 50KB–100KB while maintaining crisp display quality on mobile and desktop screens."
    },
    {
      question: "What is the difference between JPG and JPEG?",
      answer: "JPG and JPEG are identical file formats. The '.jpg' extension was introduced on older Windows operating systems with 3-letter extension limits, whereas '.jpeg' is the standard MIME type. Both compress identically."
    },
    {
      question: "How does compressing JPEG images improve Google PageSpeed?",
      answer: "Large JPEG images delay Largest Contentful Paint (LCP). Compressing your JPEG hero banners under 100KB directly boosts Core Web Vitals scores and search engine rankings."
    },
    {
      question: "Can I batch compress multiple JPEG files?",
      answer: "Yes! Drag and drop up to 20 JPEG images at once. Our client-side multi-threading compresses all files simultaneously in RAM."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <ImageCompressorClient
        initialFormat="jpeg"
        customTitle="Compress JPEG Online"
        customDescription="Reduce JPG/JPEG file sizes by up to 85% without visible quality loss. Instant batch compression with zero server uploads."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
