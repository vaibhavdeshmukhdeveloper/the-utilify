import { Metadata } from "next";
import PdfToImageClient from "../pdf-to-image/PdfToImageClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PDF to JPG Online - Free PDF to JPEG Image Converter | Utilify",
  description: "Convert PDF documents to high-resolution JPG images online for free. Extract multi-page PDF pages into crystal-clear JPEG image files with instant ZIP download.",
  alternates: {
    canonical: "/pdf-to-jpg",
  },
  openGraph: {
    title: "PDF to JPG Online - Free PDF to JPEG Converter | Utilify",
    description: "Convert every page of your PDF into crisp, high-resolution JPG images in seconds. 100% free with zero file retention.",
    url: "https://www.theutilify.com/pdf-to-jpg",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to JPG Converter Online | Utilify",
    description: "Convert multi-page PDFs into high-resolution JPG images. 100% free and private.",
  },
};

export default function PdfToJpgPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF to JPG Converter Online",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Convert PDF documents to high-resolution JPG images online for free. In-memory conversion with zero permanent server file storage.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert multi-page PDFs to high-res JPG/PNG images",
      "High DPI rendering for razor-sharp typography and tables",
      "Single-click bulk ZIP archive download",
      "Transient in-memory processing with zero file caching"
    ]
  };

  const customHowToUse = [
    { step: "Upload PDF File", description: "Drag and drop or select your PDF document from your device." },
    { step: "Instant Extraction", description: "Our high-speed rendering engine extracts every page as a high-resolution image." },
    { step: "Download JPGs", description: "Download individual page images or grab the entire multi-page document packaged in a ZIP." },
  ];

  const customFaqs = [
    {
      question: "How do I convert a multi-page PDF to JPG images?",
      answer: "Simply upload your PDF. Our converter processes every page sequentially and packages the extracted images into a convenient ZIP archive for single-click download."
    },
    {
      question: "What is the resolution of the converted JPG images?",
      answer: "PDF pages are rendered at high resolution (300 DPI equivalent) to ensure that fine text lines, financial figures, signatures, and detailed charts remain crisp and readable."
    },
    {
      question: "Are my uploaded PDF documents stored on your servers?",
      answer: "Never. Utilify operates on a strict zero-retention policy. Documents are processed transiently in server memory streams (RAM) and immediately cleared once downloaded."
    },
    {
      question: "Is there any daily limit or watermark added?",
      answer: "No. The Utilify PDF to JPG converter is 100% free forever with no daily page limits, no credit subscriptions, and zero watermarks."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <PdfToImageClient
        customTitle="PDF to JPG Converter"
        customDescription="Convert every page of your PDF into high-quality JPG images instantly. Fast, free, and completely private."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
