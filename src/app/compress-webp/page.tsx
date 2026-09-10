import { Metadata } from "next";
import ImageCompressorClient from "../image-compressor/ImageCompressorClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Compress WebP Online - Free Lossless WebP Image Optimizer | Utilify",
  description: "Compress WebP images online with zero quality loss and full alpha transparency preservation. Shrink WebP file sizes for faster page loads and better Core Web Vitals.",
  alternates: {
    canonical: "/compress-webp",
  },
  openGraph: {
    title: "Compress WebP Online - Free Lossless WebP Optimizer | Utilify",
    description: "Shrink WebP images without losing transparency or visual crispness. 100% private browser-based WebP compression.",
    url: "https://www.theutilify.com/compress-webp",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WebP Compressor - Speed Up Web Vitals | Utilify",
    description: "Compress WebP images locally with zero server uploads.",
  },
};

export default function CompressWebpPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Compress WebP Online",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Compress WebP images online with zero quality loss and full transparency preservation. 100% private client-side processing.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Lossless and lossy WebP compression algorithms",
      "Full RGBA alpha transparency preservation",
      "Dynamic quality slider and real-time byte savings counter",
      "Zero server uploads - 100% private in-browser compression"
    ]
  };

  const customHowToUse = [
    { step: "Upload WebP Images", description: "Select single or batch WebP files from your computer or phone." },
    { step: "Tune Quality Level", description: "Use the interactive compression slider to balance file size against visual fidelity." },
    { step: "Download Compressed WebPs", description: "Download optimized WebP files individually or export everything in a single ZIP archive." },
  ];

  const customFaqs = [
    {
      question: "Why should I compress WebP images?",
      answer: "While WebP is already an efficient modern image format, uncompressed camera or graphic exports frequently contain redundant metadata and excessive quality settings. Compressing them by an additional 30% to 60% drastically improves Core Web Vitals (Largest Contentful Paint) and lowers bounce rates."
    },
    {
      question: "Does compressing WebP preserve transparent backgrounds?",
      answer: "Yes. Our client-side WebP compression engine maintains 32-bit RGBA alpha channel transparency, ensuring UI graphics, logos, and cutouts render cleanly on any background color."
    },
    {
      question: "Are my WebP photos uploaded to a remote server?",
      answer: "No. All compression calculations and canvas re-encoding run 100% locally inside your web browser. Your private images never leave your device."
    },
    {
      question: "Can I batch compress multiple WebP images at once?",
      answer: "Yes! You can drag and drop dozens of WebP files simultaneously and download the entire batch bundled in a high-speed ZIP archive."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <ImageCompressorClient
        initialFormat="webp"
        customTitle="Compress WebP Online"
        customDescription="Shrink WebP images with zero quality loss. 100% client-side compression with instant ZIP download for lightning-fast web performance."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
