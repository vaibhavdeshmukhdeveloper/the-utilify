import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolsGrid } from "@/components/ToolsGrid";
import { JsonLd } from "@/components/JsonLd";
import { HeroPlayground } from "@/components/HeroPlayground";

export const metadata = {
  title: "Utilify - Free Online Utility & Productivity Tools Suite",
  description: "A professional-grade, privacy-first suite of free online utilities. Split, merge, and convert PDFs, remove background with AI, compress images, and calculate financials in seconds.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Utilify - Free Online Utility & Productivity Tools Suite",
    description: "A professional-grade, privacy-first suite of free online utilities. Split, merge, and convert PDFs, remove background with AI, compress images, and calculate financials in seconds.",
    url: "https://www.theutilify.com",
    siteName: "Utilify",
    type: "website",
  },
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Utilify",
    "url": "https://www.theutilify.com",
    "description": "Professional-grade, privacy-first free online utilities and developer tools suite.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.theutilify.com/#tools?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Utilify",
    "url": "https://www.theutilify.com",
    "logo": "https://www.theutilify.com/icon.svg",
    "sameAs": [
      "https://github.com/vaibhavdeshmukhdeveloper/the-utilify"
    ],
    "description": "Creator of high-performance, privacy-first web utilities and developer productivity tools."
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 overflow-hidden border-b bg-background">
          {/* Visual grid overlay */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="h-3.5 w-3.5" /> 100% Free, Secure & Online
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-foreground max-w-4xl mx-auto leading-[1.1]">
              Professional utilities. <br />
              <span className="text-primary italic font-serif">Simplified.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Say goodbye to premium subscriptions, cluttered interfaces, and fishy file conversions. Utilify gives you premium utility tools for completely free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 mb-8">
              <a href="#tools">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-all">
                  Explore 30 Free Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-base font-bold border-zinc-200 dark:border-zinc-800">
                  How We Protect Privacy
                </Button>
              </Link>
            </div>

            {/* High-Intent Task-First Quick Launch Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider">Quick Actions:</span>
              {[
                { label: "✂️ Split PDF", href: "/split-pdf" },
                { label: "🗜️ Compress Image", href: "/image-compressor" },
                { label: "🪄 Remove Background", href: "/background-remover" },
                { label: "📈 SIP Calculator", href: "/sip-calculator" },
                { label: "💼 Investment Planner", href: "/investment-calculator" },
                { label: "🔑 Password Gen", href: "/password-generator" },
                { label: "📝 JSON Formatter", href: "/json-formatter" },
              ].map((pill) => (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className="px-3 py-1.5 rounded-xl border border-border/70 bg-card/60 hover:bg-primary/10 hover:border-primary/30 text-xs font-bold text-foreground transition-all shadow-xs"
                >
                  {pill.label}
                </Link>
              ))}
            </div>

            {/* Instant Quick-Utility Playground */}
            <HeroPlayground />
          </div>
        </section>

        <section className="py-16 bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-muted/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">100% Client-Side Privacy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Calculators, formatters, and generators run directly in your browser. Passwords, JSON, and financial inputs never touch any server.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-muted/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">Transient RAM Processing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PDF operations and AI background removal execute purely in temporary memory streams. Files are auto-purged immediately—zero disk storage.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-muted/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-foreground">100% Free Forever</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No subscriptions, no hidden watermarks, no mandatory account sign-ups, and no 2-task daily limits. Truly unlimited utilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Tools Search Grid */}
        <ToolsGrid />
      </main>

      <Footer />
    </div>
  );
}
