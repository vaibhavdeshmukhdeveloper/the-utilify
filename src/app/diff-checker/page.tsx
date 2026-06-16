import { Metadata } from "next";
import DiffCheckerClient from "./DiffCheckerClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Diff Checker - Compare Text Side-by-Side | Utilify",
  description: "Compare two pieces of text side-by-side or inline to instantly highlight additions, deletions, and line modifications with absolute privacy.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Diff Checker",
    "description": "Compare two pieces of text side-by-side or inline to instantly highlight additions, deletions, and line modifications with absolute privacy.",
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
      <DiffCheckerClient />
    </>
  );
}
