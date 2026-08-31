import { Metadata } from "next";
import PxToRemClient from "./PxToRemClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PX to REM Converter - CSS Typography & Design Token Calculator | Utilify",
  description: "Convert pixel (px) values to relative root em (rem) units instantly for accessible responsive web design, Figma design tokens, CSS clamp(), and Tailwind CSS.",
  alternates: {
    canonical: "/px-to-rem",
  },
  openGraph: {
    title: "PX to REM Converter - Free CSS Typography Tool | Utilify",
    description: "Convert pixels to REM/EM and generate fluid typography CSS clamp() functions in seconds.",
    url: "https://www.theutilify.com/px-to-rem",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PX to REM Converter & CSS clamp() Generator | Utilify",
    description: "Convert pixel values to REM units and generate responsive typography clamp functions.",
  },
};

export default function PxToRemPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PX to REM Converter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert pixel (px) values to relative root em (rem) units instantly for accessible responsive web design, Figma design tokens, and Tailwind CSS.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Bidirectional PX to REM and REM to PX converter",
      "Customizable root HTML base font size",
      "Fluid typography CSS clamp() generator",
      "Tailwind CSS v4 & standard token cheat sheet table"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <PxToRemClient />
    </>
  );
}
