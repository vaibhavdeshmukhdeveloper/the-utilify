import { Metadata } from "next";
import { CategoryHubLayout, CategoryToolItem, CategoryFaqItem } from "@/components/CategoryHubLayout";

export const metadata: Metadata = {
  title: "Free Online Image Tools & Optimization Suite - Background Remover & Compressor | Utilify",
  description: "Free online image manipulation suite: AI background remover with full-resolution PNG export, client-side lossy/lossless image compressor, and WCAG color palette generator.",
  alternates: {
    canonical: "/category/image-tools",
  },
  openGraph: {
    title: "Free Online Image Tools Suite | Utilify",
    description: "Remove image backgrounds with deep-learning AI, compress WebP/JPG/PNG images client-side, and generate accessible color palettes.",
    url: "https://www.theutilify.com/category/image-tools",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Utilities | Utilify",
    description: "AI background removal, in-browser image compression, and color palette creation.",
  },
};

const imageTools: CategoryToolItem[] = [
  {
    title: "AI Background Remover",
    description: "Isolate subjects and export transparent PNGs with deep learning segmentation models. Includes an interactive canvas eraser/repair brush.",
    href: "/background-remover",
    badge: "AI Powered",
    features: [
      "Full-resolution transparent PNG downloads",
      "Built-in manual canvas brush editor",
      "No credit fees or paywalls",
    ],
  },
  {
    title: "Image Compressor",
    description: "Reduce image file sizes by up to 80% without perceptible visual loss. All compression runs 100% locally inside your web browser.",
    href: "/image-compressor",
    badge: "Client Side",
    features: [
      "Supports WebP, PNG, and JPEG formats",
      "Dynamic quality slider with live byte counters",
      "Zero server uploads - 100% private",
    ],
  },
  {
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes based on classic color theory and analyze WCAG 2.1 accessibility contrast ratios in real-time.",
    href: "/color-palette",
    badge: "Design",
    features: [
      "Harmonies: Complementary, Monochromatic, Triadic",
      "WCAG AA & AAA contrast ratio checks",
      "Copy HEX, RGB, HSL, or CSS variables",
    ],
  },
];

const imageFaqs: CategoryFaqItem[] = [
  {
    question: "Does the AI Background Remover downscale image resolutions like Remove.bg?",
    answer: "No. Unlike legacy tools that restrict free users to low-resolution 0.25-megapixel previews, Utilify returns the full original pixel resolution of your uploaded image in lossless transparent PNG format without any paid credits.",
  },
  {
    question: "Do my images get uploaded to external servers when using the Image Compressor?",
    answer: "No. The Utilify Image Compressor executes 100% client-side inside your browser's HTML5 Canvas engine. Your images never leave your local device.",
  },
  {
    question: "How do optimized images improve Google Core Web Vitals (LCP)?",
    answer: "Compressing hero banners and product images to next-gen formats like WebP significantly reduces total byte payload, enabling the largest visible elements on web pages to render under Google's 2.5-second LCP benchmark.",
  },
];

export default function ImageToolsCategoryPage() {
  return (
    <CategoryHubLayout
      categoryName="Image &amp; Media Tools"
      categorySlug="image-tools"
      headline="Free Online Image Tools &amp; Optimization Suite"
      subheadline="Studio-grade AI background removal, client-side WebP/PNG compression, and accessible color generation."
      description="Professional online image suite. Remove backgrounds with AI, compress images client-side, and generate accessible color palettes for free."
      tools={imageTools}
      faqs={imageFaqs}
      detailedContent={
        <div>
          <h2>Optimize Visual Content for E-Commerce, Web &amp; Design</h2>
          <p>
            High-fidelity visual assets are crucial for modern e-commerce stores, portfolio websites, and digital marketing campaigns. However, heavy photographic assets often slow down mobile web performance and penalize SEO rankings.
          </p>
          <p>
            Utilify combines state-of-the-art AI segmentation algorithms with browser-local image encoders to deliver studio-quality outputs at zero cost.
          </p>
        </div>
      }
    />
  );
}
