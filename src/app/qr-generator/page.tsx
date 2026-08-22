import { Metadata } from "next";
import QrGeneratorClient from "./QrGeneratorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "QR Code Generator - Custom QR Codes with Colors Online Free | Utilify",
  description: "Generate high-resolution custom QR codes for URLs, Wi-Fi networks, text, contacts, and emails. Customize colors and error correction with instant PNG download.",
  alternates: {
    canonical: "/qr-generator",
  },
  openGraph: {
    title: "QR Code Generator - Free Custom QR Codes | Utilify",
    description: "Generate styled QR codes with customized colors and sizes. Free and instant.",
    url: "https://www.theutilify.com/qr-generator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Custom QR Code Generator | Utilify",
    description: "Create crisp, high-resolution QR codes for websites and Wi-Fi.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QR Code Generator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Create completely custom, high-quality QR codes for links, plain text, Wi-Fi details, emails, or phone numbers. Customize colors and download as PNG.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Custom foreground and background color pickers",
      "Support for URLs, plain text, and Wi-Fi credentials",
      "High-resolution vector-rendered PNG export",
      "100% client-side generation without API limits"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <QrGeneratorClient />
    </>
  );
}
