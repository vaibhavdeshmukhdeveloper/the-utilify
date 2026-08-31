import { Metadata } from "next";
import ImageCompressorClient from "./ImageCompressorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Image Compressor - Compress JPG, PNG, and WebP Online Free | Utilify",
  description: "Compress image file sizes by up to 80% with zero quality loss. Optimize JPG, PNG, and WebP files locally in your browser with custom quality controls.",
  alternates: {
    canonical: "/image-compressor",
  },
  openGraph: {
    title: "Image Compressor - Free Lossless & Lossy Compression | Utilify",
    description: "Shrink image file size without losing visual clarity. Fast browser-based compression for JPG, PNG, and WebP.",
    url: "https://www.theutilify.com/image-compressor",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Compressor - JPG, PNG, WebP | Utilify",
    description: "Reduce image file size with zero quality loss in your browser.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Image Compressor",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Compress image file size without losing quality. Adjust compression quality of JPG, PNG, and WebP images for free.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2890",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Client-side image compression in WebAssembly/Canvas",
      "Supports JPG, PNG, and WebP formats",
      "Dynamic quality slider with live size preview",
      "Zero server uploads - 100% private"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <ImageCompressorClient />
    </>
  );
}
