import { Metadata } from "next";
import ColorPaletteClient from "./ColorPaletteClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Color Palette Generator - Harmonic Schemes & WCAG Contrast Checker | Utilify",
  description: "Generate harmonic color palettes (monochromatic, analogous, complementary, triadic) and test WCAG 2.1 accessibility contrast ratios in real-time.",
  alternates: {
    canonical: "/color-palette",
  },
  openGraph: {
    title: "Color Palette Generator & WCAG Contrast Checker | Utilify",
    description: "Generate color schemes and test accessibility contrast live in your browser.",
    url: "https://www.theutilify.com/color-palette",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Color Palette Generator | Utilify",
    description: "Harmonic color schemes and WCAG contrast analyzer for UI designers.",
  },
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Color Palette Generator",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Generate beautiful, random, or harmonic color palettes (analogous, triadic, monochromatic) and analyze WCAG contrast ratios in your browser.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1830",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Color theory harmonies: Complementary, Monochromatic, Analogous, Triadic, Tetradic",
      "Live WCAG AA and AAA accessibility contrast ratio checker",
      "HEX, RGB, and HSL format copy",
      "Export palette as CSS variables or image"
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <ColorPaletteClient />
    </>
  );
}
