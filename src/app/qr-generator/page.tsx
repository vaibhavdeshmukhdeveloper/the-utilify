import { Metadata } from "next";
import QrGeneratorClient from "./QrGeneratorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Custom QR Codes | Utilify",
  description: "Create completely custom, high-quality QR codes for links, plain text, Wi-Fi details, emails, or phone numbers. Customize colors and download as PNG.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QR Code Generator",
    "description": "Create completely custom, high-quality QR codes for links, plain text, Wi-Fi details, emails, or phone numbers. Customize colors and download as PNG.",
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
      <QrGeneratorClient />
    </>
  );
}
