import { Metadata } from "next";
import PdfToImageClient from "./PdfToImageClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PDF to Image Converter - Free Online PDF to PNG/JPG | Utilify",
  description: "Convert PDF pages to high-quality images online. Easy, fast, secure, and completely free PDF to PNG or JPG conversion.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF to Image Converter",
    "description": "Convert PDF pages to high-quality images online. Easy, fast, secure, and completely free PDF to PNG or JPG conversion.",
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
      <PdfToImageClient />
    </>
  );
}
