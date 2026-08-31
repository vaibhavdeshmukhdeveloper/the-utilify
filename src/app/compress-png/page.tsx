import { Metadata } from "next";
import ImageCompressorClient from "../image-compressor/ImageCompressorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Compress PNG Online - Free Lossless PNG Image Optimizer | Utilify",
  description: "Compress PNG images online with zero quality loss and full transparency preservation. Shrink PNG file sizes by up to 80% locally in your browser.",
  alternates: {
    canonical: "/compress-png",
  },
  openGraph: {
    title: "Compress PNG Online - Free Lossless PNG Optimizer | Utilify",
    description: "Shrink PNG images without losing transparency or crisp text. Fast, 100% private browser-based PNG compression.",
    url: "https://www.theutilify.com/compress-png",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PNG Compressor - Lossless & Transparent | Utilify",
    description: "Compress transparent PNG graphics with zero server uploads.",
  },
};

export default function CompressPngPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Compress PNG Online",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Compress PNG images online with zero quality loss and full transparency preservation. 100% private client-side processing.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossless PNG compression algorithm",
      "Full transparency alpha channel preservation",
      "Dynamic quality slider and live byte counter",
      "Zero server uploads - 100% private in-browser compression"
    ]
  };

  const customHowToUse = [
    { step: "Upload PNG Files", description: "Select single or multiple transparent PNG images up to 25MB." },
    { step: "Adjust Compression", description: "Choose the target quality level to optimize color tables and strip metadata." },
    { step: "Download Optimized PNGs", description: "Download individual transparent PNGs or export all files in a single ZIP." },
  ];

  const customFaqs = [
    {
      question: "Does PNG compression remove transparency?",
      answer: "No. Our compression engine preserves full 32-bit RGBA alpha channel transparency while reducing palette redundancies and stripping unnecessary metadata."
    },
    {
      question: "How much can I shrink a transparent PNG file?",
      answer: "Typical PNG files shrink by 40% to 75% in size without any perceptible degradation to typography, vector icons, or transparent logos."
    },
    {
      question: "Can I convert compressed PNGs to modern WebP for even smaller sizes?",
      answer: "Yes! You can toggle the output format to WebP to achieve an additional 25–30% file size reduction while keeping transparent backgrounds intact."
    },
    {
      question: "Is it safe to compress confidential brand logos and UI graphics?",
      answer: "Absolutely. All compression logic runs 100% client-side in your web browser. Your images never touch any external server or cloud database."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <ImageCompressorClient
        initialFormat="png"
        customTitle="Compress PNG Online"
        customDescription="Shrink transparent PNG images with zero quality loss. 100% client-side compression with instant ZIP download."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
