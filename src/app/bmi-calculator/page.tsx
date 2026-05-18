import { Metadata } from "next";
import BmiCalculatorClient from "./BmiCalculatorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "BMI Calculator - Calculate Your Body Mass Index | Utilify",
  description: "Calculate your Body Mass Index (BMI) easily with our free online calculator. Get personalized health classification and healthy weight ranges.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BMI Calculator",
    "description": "Calculate your Body Mass Index (BMI) easily with our free online calculator. Get personalized health classification and healthy weight ranges.",
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
      <BmiCalculatorClient />
    </>
  );
}
