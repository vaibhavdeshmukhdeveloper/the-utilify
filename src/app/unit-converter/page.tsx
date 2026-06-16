import { Metadata } from "next";
import UnitConverterClient from "./UnitConverterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Unit Converter - Convert Length, Weight, Temp & Area | Utilify",
  description: "Easily convert units for length, weight, temperature, area, and volume with our instant, client-side utility converter.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Unit Converter",
    "description": "Easily convert units for length, weight, temperature, area, and volume with our instant, client-side utility converter.",
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
      <UnitConverterClient />
    </>
  );
}
