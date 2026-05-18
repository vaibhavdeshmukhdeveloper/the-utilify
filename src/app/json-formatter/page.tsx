import { Metadata } from "next";
import JsonFormatterClient from "./JsonFormatterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Clean and Pretty Print JSON | Utilify",
  description: "Free online JSON formatter and validator to clean, format, validate, and minify your JSON data. Clean syntax errors instantly.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JSON Formatter & Validator",
    "description": "Free online JSON formatter and validator to clean, format, validate, and minify your JSON data. Clean syntax errors instantly.",
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
      <JsonFormatterClient />
    </>
  );
}
