import { Metadata } from "next";
import { ComparisonLayout, ComparisonRow, ComparisonFaq } from "@/components/ComparisonLayout";

export const metadata: Metadata = {
  title: "Best Free TinyPNG Alternative - 100% Client-Side In-Browser Compression | Utilify",
  description: "Looking for a privacy-first, free alternative to TinyPNG? Compress WebP, PNG, and JPEG images locally in your browser with dynamic quality controls and zero server uploads.",
  alternates: {
    canonical: "/vs/tinypng",
  },
  openGraph: {
    title: "Best Free TinyPNG Alternative | Utilify",
    description: "Compare The Utilify vs TinyPNG. 100% in-browser client-side compression without server upload limits.",
    url: "https://www.theutilify.com/vs/tinypng",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilify vs TinyPNG - In-Browser Free Image Compressor",
    description: "Compress WebP, PNG, and JPG images client-side with zero server transmission.",
  },
};

const tableRows: ComparisonRow[] = [
  { feature: "Client-Side Processing (Zero Server Upload)", utilify: true, competitor: "False (Uploaded to remote servers)", highlight: true },
  { feature: "Next-Gen WebP Compression", utilify: true, competitor: "Limited / Add-on" },
  { feature: "Max File Size / Batch Limits", utilify: "Unlimited Free", competitor: "5MB per image / 20 image batch limit" },
  { feature: "Dynamic Quality Slider", utilify: "Granular 1% to 100% control", competitor: "Automatic preset only" },
  { feature: "Live Byte Savings Indicator", utilify: true, competitor: true },
  { feature: "Account / API Key Required", utilify: false, competitor: "Required for high volume" },
  { feature: "100% Free Forever", utilify: true, competitor: "Subscription required for unlimited" },
];

const faqs: ComparisonFaq[] = [
  {
    question: "How does Utilify compress images without uploading them to a server?",
    answer: "Utilify utilizes modern HTML5 Canvas and browser-native WebAssembly image encoders. All compression math runs directly on your device's CPU and GPU, ensuring your images never travel across the internet.",
  },
  {
    question: "Can I compress images to the modern WebP format for Core Web Vitals?",
    answer: "Yes! Utilify allows you to compress JPG, PNG, and WebP images and convert them into lightweight WebP graphics with dynamic quality sliders.",
  },
  {
    question: "Is there a 5MB or 20-image limit like on TinyPNG?",
    answer: "No! Because processing occurs inside your web browser, there are zero arbitrary file size or batch quantity limits.",
  },
];

export default function VsTinyPngPage() {
  return (
    <ComparisonLayout
      competitorName="TinyPNG"
      competitorSlug="tinypng"
      headline="The Client-Side, Free Alternative to TinyPNG"
      subheadline="Compress WebP, PNG, and JPEG images locally in your browser with zero server uploads, custom quality controls, and no batch limits."
      targetToolName="Image Compressor"
      targetToolHref="/image-compressor"
      targetToolAction="Launch Image Compressor"
      tableRows={tableRows}
      faqs={faqs}
      detailedContent={
        <div>
          <h2>Why Browser-Native Image Compression is the Superior Standard</h2>
          <p>
            Legacy compressors like TinyPNG require uploading every single photo, product banner, and UI screenshot to remote cloud servers to be processed and downloaded back. For confidential graphics, medical scans, or large photo batches, uploading files over the internet wastes network bandwidth and introduces privacy risks.
          </p>
          <p>
            <strong>The Utilify Image Compressor</strong> executes 100% client-side inside your browser. You get lightning-fast compression, granular control over visual quality percentages, and absolute privacy.
          </p>
        </div>
      }
    />
  );
}
