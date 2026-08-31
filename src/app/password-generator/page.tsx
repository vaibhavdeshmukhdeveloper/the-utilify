import { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Password Generator - Strong Random Passwords Online Free | Utilify",
  description: "Generate cryptographically secure, random passwords with custom symbols, numbers, and entropy strength scoring. 100% client-side with zero server storage.",
  alternates: {
    canonical: "/password-generator",
  },
  openGraph: {
    title: "Password Generator - Secure Random Password Generator | Utilify",
    description: "Generate random, high-entropy passwords with custom length and character sets. Zero server transmission.",
    url: "https://www.theutilify.com/password-generator",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secure Password Generator | Utilify",
    description: "Create strong, uncrackable passwords client-side in your browser.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Password Generator",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Create strong, customizable, highly secure passwords to protect your online accounts. Standard client-side generation ensures absolute privacy.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cryptographically secure pseudo-random number generator (crypto.getRandomValues)",
      "Customizable character sets (uppercase, lowercase, numbers, symbols)",
      "Real-time password entropy and crack time estimation",
      "Client-side execution with zero network transmission"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <PasswordGeneratorClient />
    </>
  );
}
