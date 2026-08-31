import { Metadata } from "next";
import BackgroundRemoverClient from "../background-remover/BackgroundRemoverClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Make Signature Background Transparent - Free AI Signature Extractor | Utilify",
  description: "Extract clean, transparent digital signatures from paper photos or scanned documents. 100% private, instant transparent PNG download for contracts and PDFs.",
  alternates: {
    canonical: "/make-signature-transparent",
  },
  openGraph: {
    title: "Make Signature Background Transparent - Free AI Extractor | Utilify",
    description: "Extract ink signatures from paper photos with crisp transparent PNG backgrounds for PDF signing and contracts.",
    url: "https://www.theutilify.com/make-signature-transparent",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make Signature Background Transparent - Free AI Tool | Utilify",
    description: "Convert paper signature photos into transparent digital PNGs instantly.",
  },
};

export default function MakeSignatureTransparentPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Make Signature Background Transparent",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Extract clean, transparent digital signatures from paper photos or scanned documents with instant transparent PNG output.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI ink segmentation algorithm",
      "Removes paper shadows, creases, and off-white background tints",
      "Exports high-resolution transparent PNG with preserved stroke weight",
      "Zero server retention - strictly in-memory processing"
    ]
  };

  const customHowToUse = [
    { step: "Snap a Photo of Your Signature", description: "Sign on plain white paper with a dark pen and snap a clear photo with your phone." },
    { step: "Upload to Utilify", description: "Drop your signature photo into the extractor. Our AI isolates the ink strokes instantly." },
    { step: "Download Transparent PNG", description: "Export the clean, isolated signature as a transparent PNG and insert it into Word, DocuSign, or PDF contracts." },
  ];

  const customFaqs = [
    {
      question: "How do I make my written signature transparent for signing PDFs?",
      answer: "Sign your name with a black or blue pen on blank white paper. Take a well-lit photo from above and upload it here. Our AI strips away the background paper texture, leaving a crystal-clear transparent PNG."
    },
    {
      question: "Can I use this transparent signature on legal contracts and invoices?",
      answer: "Yes! The exported PNG file has full alpha transparency and can be dropped directly into PDF editors, Adobe Acrobat, Microsoft Word, Google Docs, or invoicing software."
    },
    {
      question: "Is it safe to upload my signature here?",
      answer: "Yes. Your privacy and security are guaranteed. Utilify processes signature images purely in transient volatile memory streams and immediately releases memory upon download. No files or signatures are ever stored to disk."
    },
    {
      question: "What should I do if my photo has shadows or phone glare?",
      answer: "Our solid-background and AI neural models automatically filter out uneven paper shadows. For best results, use bright, even room lighting without direct flash reflection."
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <BackgroundRemoverClient
        initialBgMode="transparent"
        customTitle="Make Signature Background Transparent"
        customDescription="Extract clean, transparent digital signatures from paper photos or scanned documents. 100% private, instant transparent PNG download for contracts and PDFs."
        customHowToUse={customHowToUse}
        customFaqs={customFaqs}
      />
    </>
  );
}
