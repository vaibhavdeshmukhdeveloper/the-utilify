"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, Zap, ArrowUpRight } from "lucide-react";

interface WorkflowStep {
  badge: string;
  title: string;
  description: string;
  actionText: string;
  targetHref: string;
}

export function ToolWorkflowChaining() {
  const pathname = usePathname();
  const slug = pathname ? pathname.replace(/^\//, "").split("/")[0] : "";

  const getWorkflowStep = (): WorkflowStep | null => {
    switch (slug) {
      case "background-remover":
        return {
          badge: "Step 2: Optimize Asset",
          title: "Want to compress this transparent cutout for faster web loading?",
          description: "Reduce PNG file size by up to 80% without losing transparent edges or clarity.",
          actionText: "Open Image Compressor",
          targetHref: "/image-compressor",
        };
      case "image-compressor":
        return {
          badge: "Complementary Tool",
          title: "Need to remove background backdrops from your images?",
          description: "Use our in-memory AI background remover to isolate subjects in seconds.",
          actionText: "Try AI Background Remover",
          targetHref: "/background-remover",
        };
      case "split-pdf":
        return {
          badge: "Step 2: Visual Conversion",
          title: "Want to convert your extracted PDF pages into high-res PNG or JPG images?",
          description: "Render crystal-clear vector images from any PDF page without losing sharpness.",
          actionText: "Convert PDF to Image",
          targetHref: "/pdf-to-image",
        };
      case "merge-pdf":
        return {
          badge: "Complementary Tool",
          title: "Need to extract specific page ranges from a large PDF binder?",
          description: "Isolate individual exhibits, addendums, and signature blocks in seconds.",
          actionText: "Use Split PDF",
          targetHref: "/split-pdf",
        };
      case "pdf-to-image":
        return {
          badge: "Step 2: Asset Optimization",
          title: "Want to shrink these rendered image files before sharing?",
          description: "Compress JPG, PNG, and WebP images locally with customizable quality sliders.",
          actionText: "Compress Image Files",
          targetHref: "/image-compressor",
        };
      case "markdown-to-pdf":
        return {
          badge: "Step 2: Content Audit",
          title: "Want to verify word counts, character limits, and reading times?",
          description: "Audit your technical documentation or resume before sending it to hiring managers.",
          actionText: "Open Word Counter",
          targetHref: "/word-counter",
        };
      case "json-formatter":
        return {
          badge: "Developer Workflow",
          title: "Need to compare two JSON payloads or API responses side-by-side?",
          description: "Highlight missing keys, schema variations, and data diffs with visual color coding.",
          actionText: "Compare in Diff Checker",
          targetHref: "/diff-checker",
        };
      case "base64":
        return {
          badge: "Developer Workflow",
          title: "Need to format and validate decoded JSON strings?",
          description: "Pretty-print, validate syntax, and inspect nested claims instantly.",
          actionText: "Format JSON",
          targetHref: "/json-formatter",
        };
      case "diff-checker":
        return {
          badge: "Developer Workflow",
          title: "Working with JSON data? Format and validate payloads before comparing.",
          description: "Pretty-print messy JSON payloads to get clean, readable text diffs.",
          actionText: "Open JSON Formatter",
          targetHref: "/json-formatter",
        };
      case "sip-calculator":
        return {
          badge: "Financial Planning",
          title: "Want to model a one-time lump sum investment alongside your monthly SIP?",
          description: "Calculate compounding growth, maturity value, and annualized portfolio returns.",
          actionText: "Launch Investment Calculator",
          targetHref: "/investment-calculator",
        };
      case "investment-calculator":
        return {
          badge: "Financial Planning",
          title: "Want to calculate monthly SIP investments with annual Step-Up increments?",
          description: "Harness compound interest with automated yearly investment increases.",
          actionText: "Launch SIP Calculator",
          targetHref: "/sip-calculator",
        };
      case "password-generator":
        return {
          badge: "Security Workflow",
          title: "Need to share Wi-Fi credentials or secure links offline via QR Code?",
          description: "Generate high-resolution printable QR codes with custom colors and error correction.",
          actionText: "Generate QR Code",
          targetHref: "/qr-generator",
        };
      case "qr-generator":
        return {
          badge: "Design Workflow",
          title: "Want to create matching brand colors with high WCAG contrast?",
          description: "Generate beautiful color harmonies and test readability against light and dark backdrops.",
          actionText: "Open Color Palette Generator",
          targetHref: "/color-palette",
        };
      case "color-palette":
        return {
          badge: "Design Workflow",
          title: "Ready to test your brand colors on custom QR codes?",
          description: "Generate branded QR codes using custom foreground and background hex codes.",
          actionText: "Create Branded QR Code",
          targetHref: "/qr-generator",
        };
      case "unit-converter":
        return {
          badge: "Developer Utility",
          title: "Working on code or database naming? Convert variable casing seamlessly.",
          description: "Convert strings across camelCase, snake_case, PascalCase, kebab-case, and Title Case.",
          actionText: "Open Text Case Converter",
          targetHref: "/text-converter",
        };
      case "text-converter":
        return {
          badge: "Writing Utility",
          title: "Need to audit word counts, reading duration, and social character limits?",
          description: "Analyze paragraphs, sentence counts, and reading pace in real-time.",
          actionText: "Open Word Counter",
          targetHref: "/word-counter",
        };
      case "word-counter":
        return {
          badge: "Writing Utility",
          title: "Need dummy copy for wireframes, UI mockups, or layout testing?",
          description: "Generate custom paragraphs of formatted Lorem Ipsum placeholder text.",
          actionText: "Generate Lorem Ipsum",
          targetHref: "/lorem-ipsum",
        };
      case "date-calculator":
        return {
          badge: "Calendar Utility",
          title: "Want to calculate your exact chronological age in years, months, and days?",
          description: "Find your precise age and countdown days until your next birthday milestone.",
          actionText: "Open Age Calculator",
          targetHref: "/age-calculator",
        };
      case "age-calculator":
        return {
          badge: "Calendar Utility",
          title: "Need to calculate business days or add/subtract time intervals between dates?",
          description: "Measure duration between two calendar dates with day-of-week breakdown.",
          actionText: "Open Date Calculator",
          targetHref: "/date-calculator",
        };
      default:
        return null;
    }
  };

  const workflow = getWorkflowStep();
  if (!workflow) return null;

  return (
    <div className="w-full mt-8 p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-black uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5" /> {workflow.badge}
        </div>
        <h4 className="text-lg font-black text-foreground tracking-tight">{workflow.title}</h4>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">{workflow.description}</p>
      </div>

      <Link href={workflow.targetHref} className="shrink-0 w-full sm:w-auto">
        <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
          {workflow.actionText} <ArrowUpRight className="h-4 w-4" />
        </button>
      </Link>
    </div>
  );
}
