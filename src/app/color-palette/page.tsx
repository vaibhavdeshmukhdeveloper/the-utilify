import { Metadata } from "next";
import ColorPaletteClient from "./ColorPaletteClient";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Color Palette Generator - Design Harmonic Schemes | Utilify",
  description: "Generate beautiful, random, or harmonic color palettes (analogous, triadic, monochromatic) and analyze WCAG contrast ratios in your browser.",
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Color Palette Generator",
    "description": "Generate beautiful, random, or harmonic color palettes (analogous, triadic, monochromatic) and analyze WCAG contrast ratios in your browser.",
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
      <ColorPaletteClient />
    </>
  );
}
