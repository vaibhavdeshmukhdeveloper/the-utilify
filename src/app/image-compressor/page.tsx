import { Metadata } from "next";
import ImageCompressorClient from "./ImageCompressorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Image Compressor - Compress JPG, PNG, and WebP Online | Utilify",
  description: "Compress image file size without losing quality. Adjust compression quality of JPG, PNG, and WebP images for free.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Image Compressor",
    "description": "Compress image file size without losing quality. Adjust compression quality of JPG, PNG, and WebP images for free.",
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
      <ImageCompressorClient />
    </>
  );
}
