import { Metadata } from "next";
import BackgroundRemoverClient from "../background-remover/BackgroundRemoverClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "White Background Product Photo Editor - Amazon & Shopify Ready | Utilify",
  description: "Convert product photos to a pure white background (#FFFFFF) instantly with AI. Meet Amazon, eBay, and Shopify seller guidelines with studio-grade cutouts.",
  alternates: {
    canonical: "/white-background-product-photos",
  },
  openGraph: {
    title: "White Background Product Photo Editor - E-Commerce AI | Utilify",
    description: "Transform product photography into Amazon-compliant pure white background (#FFFFFF) catalog shots in seconds.",
    url: "https://www.theutilify.com/white-background-product-photos",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "White Background Product Photo Editor | Utilify",
    description: "Create Amazon & Shopify ready pure white background product images with AI.",
  },
};

export default function WhiteBackgroundProductPhotosPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "White Background Product Photo Editor",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert product photos to a pure white background (#FFFFFF) instantly with AI for Amazon, eBay, and Shopify compliance.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI product edge segmentation with shadow synthesis",
      "Pure RGB (255, 255, 255) Amazon main image compliance",
      "Interactive brush editor for fine detailing",
      "Zero subscription credits or watermark restrictions"
    ]
  };

  const customHowToUse = [
    { step: "Upload Product Shot", description: "Select single or multiple product photos taken on any background." },
    { step: "AI White Background Cutout", description: "Our neural network isolates the product and injects a pure studio-white (#FFFFFF) backdrop." },
    { step: "Export for E-Commerce", description: "Download high-resolution product photos ready for direct upload to Amazon, Shopify, or eBay." },
  ];

  const customFaqs = [
    {
      question: "Does this meet Amazon's pure white background requirement?",
      answer: "Yes. Amazon strictly enforces that main hero product images must have an RGB value of 255, 255, 255 (HEX #FFFFFF). Our tool replaces any background with exact 100% pure white."
    },
    {
      question: "Can I use this for complex products like apparel, jewelry, or glassware?",
      answer: "Yes! Our deep learning models (`isnet-general-use` and `u2net_cloth_seg`) are trained to handle intricate product contours including apparel folds, jewelry reflections, and fine edges."
    },
    {
      question: "Are there any credit limits or image downsampling on free downloads?",
      answer: "None! The Utilify offers 100% free full-resolution downloads without subscription paywalls, watermarks, or credit limits."
    },
    {
      question: "How can I optimize the product images for fast Shopify loading speeds?",
      answer: "After creating your white background product shots, run them through our [Image Compressor](/image-compressor) to reduce file sizes under 100KB for blazing fast website load times."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <BackgroundRemoverClient
        initialBgMode="white"
        customTitle="White Background Product Photo Editor"
        customDescription="Transform product photography into Amazon-compliant pure white background (#FFFFFF) catalog shots in seconds with AI."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
