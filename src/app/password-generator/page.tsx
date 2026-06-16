import { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Password Generator - Create Strong & Secure Passwords | Utilify",
  description: "Create strong, customizable, highly secure passwords to protect your online accounts. Standard client-side generation ensures absolute privacy.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Password Generator",
    "description": "Create strong, customizable, highly secure passwords to protect your online accounts. Standard client-side generation ensures absolute privacy.",
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
      <PasswordGeneratorClient />
    </>
  );
}
