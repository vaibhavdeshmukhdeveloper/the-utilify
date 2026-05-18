import { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "SIP Calculator - Calculate Monthly Mutual Fund Returns | Utilify",
  description: "Calculate your mutual fund returns easily with our free SIP calculator. Plan your investment and get clear estimates of your maturity wealth.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SIP Calculator",
    "description": "Calculate your mutual fund returns easily with our free SIP calculator. Plan your investment and get clear estimates of your maturity wealth.",
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
      <SipCalculatorClient />
    </>
  );
}
