import { Metadata } from "next";
import Base64Client from "./Base64Client";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - Convert Text or Files | Utilify",
  description: "Encode plain text or upload binary files to Base64 format, and decode Base64 strings back to text or files instantly and securely.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Base64 Encoder & Decoder",
    "description": "Encode plain text or upload binary files to Base64 format, and decode Base64 strings back to text or files instantly and securely.",
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
      <Base64Client />
    </>
  );
}
