import { useCases } from "@/lib/use-cases-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, Shield, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

// Import all client tools dynamically or directly since this is a server wrapper
import BackgroundRemoverClient from "@/app/background-remover/BackgroundRemoverClient";
import PdfToImageClient from "@/app/pdf-to-image/PdfToImageClient";
import SplitPdfClient from "@/app/split-pdf/SplitPdfClient";
import MergePdfClient from "@/app/merge-pdf/MergePdfClient";
import ImageCompressorClient from "@/app/image-compressor/ImageCompressorClient";
import MarkdownToPdfClient from "@/app/markdown-to-pdf/MarkdownToPdfClient";
import SipCalculatorClient from "@/app/sip-calculator/SipCalculatorClient";
import InvestmentCalculatorClient from "@/app/investment-calculator/InvestmentCalculatorClient";
import BmiCalculatorClient from "@/app/bmi-calculator/BmiCalculatorClient";
import JsonFormatterClient from "@/app/json-formatter/JsonFormatterClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for absolute SEO perfection
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = useCases.find((uc) => uc.slug === slug);
  if (!data) return {};

  return {
    title: data.seoTitle,
    description: data.seoDescription,
    alternates: {
      canonical: `https://www.theutilify.com/use-case/${slug}`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      url: `https://www.theutilify.com/use-case/${slug}`,
      siteName: "Utilify",
      type: "website",
    }
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const data = useCases.find((uc) => uc.slug === slug);

  if (!data) {
    notFound();
  }

  // Map the base tool slug to the correct Client Component
  const renderClientTool = () => {
    switch (data.baseTool) {
      case "background-remover":
        return <BackgroundRemoverClient />;
      case "pdf-to-image":
        return <PdfToImageClient />;
      case "split-pdf":
        return <SplitPdfClient />;
      case "merge-pdf":
        return <MergePdfClient />;
      case "image-compressor":
        return <ImageCompressorClient />;
      case "markdown-to-pdf":
        return <MarkdownToPdfClient />;
      case "sip-calculator":
        return <SipCalculatorClient />;
      case "investment-calculator":
        return <InvestmentCalculatorClient />;
      case "bmi-calculator":
        return <BmiCalculatorClient />;
      case "json-formatter":
        return <JsonFormatterClient />;
      default:
        return notFound();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Niche Landing Page Header */}
        <section className="relative py-16 border-b bg-card overflow-hidden">
          {/* Subtle grid background overlay */}
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back to use cases directory */}
            <Link href="/use-cases" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to use cases directory
            </Link>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Specialized Use Case
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 text-foreground leading-[1.15]">
                {data.heading}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {data.introduction}
              </p>
            </div>
          </div>
        </section>

        {/* Niche Context Banner (Privacy & Speed indicators) */}
        <section className="py-6 bg-muted/30 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <span><strong>Privacy Guaranteed:</strong> Processed fully in-memory with zero disk storage.</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span><strong>No Paywalls:</strong> Completely free online extraction with zero advertisements.</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
                <span><strong>Shopify & Portal Ready:</strong> Outputs matching official sizing standards.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Tool Implementation */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Interactive Console</span>
            </div>
            {renderClientTool()}
          </div>
        </section>

        {/* Specialized Pro-Tips / Best Practices */}
        <section className="py-16 bg-muted/20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight mb-8 text-foreground">
                Professional Tips & Best Practices
              </h2>
              <div className="space-y-4">
                {data.tips.map((tip, idx) => (
                  <Card key={idx} className="p-6 border bg-card rounded-2xl flex gap-4 shadow-sm items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-black">{idx + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
                      {tip}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
