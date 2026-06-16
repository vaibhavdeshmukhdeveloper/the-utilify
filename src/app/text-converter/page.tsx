import { Metadata } from "next";
import TextConverterClient from "./TextConverterClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Text Case Converter - Convert Text Formats Online | Utilify",
  description: "Convert text formats instantly (UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case) and view detailed word and character counts.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Text Case Converter",
    "description": "Convert text formats instantly (UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case) and view detailed word and character counts.",
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
      <TextConverterClient />
    </>
  );
}
