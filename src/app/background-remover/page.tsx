import { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AI Background Remover - Free Online Image Background Removal | Utilify",
  description: "Remove background from images automatically in one click. High-resolution transparent PNG output powered by AI.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Background Remover",
    "description": "Remove background from images automatically in one click. High-resolution transparent PNG output powered by AI.",
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
      <BackgroundRemoverClient />
    </>
  );
}
