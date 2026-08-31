import { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AI Background Remover - Free Transparent PNG in Seconds (No Sign-Up) | Utilify",
  description: "Remove background from images instantly using deep learning AI. Download crystal-clear transparent PNGs with zero watermarks and zero file storage.",
  alternates: {
    canonical: "/background-remover",
  },
  openGraph: {
    title: "AI Background Remover - Free Transparent PNG (No Sign-Up) | Utilify",
    description: "Remove image backgrounds automatically in one click. High-resolution transparent PNG cutouts powered by AI.",
    url: "https://www.theutilify.com/background-remover",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Background Remover - 100% Free & Fast | Utilify",
    description: "Instant AI background removal. Zero sign-up, zero watermarks, 100% private.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Background Remover",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Remove background from images automatically in one click. High-resolution transparent PNG output powered by AI.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Automatic AI foreground isolation",
      "Transparent PNG and solid color background output",
      "Built-in manual eraser and repair canvas brush",
      "Zero file retention - RAM only processing"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <BackgroundRemoverClient />
    </>
  );
}
