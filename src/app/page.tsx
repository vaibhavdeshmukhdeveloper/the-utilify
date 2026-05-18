import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  FileText,
  ImageIcon,
  Calculator,
  Code,
  Layers,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  PiggyBank,
  FileJson,
  Activity,
  FileCode,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Utilify - Free Online Utility & Productivity Tools Suite",
  description: "A professional-grade, privacy-first suite of free online utilities. Split, merge, and convert PDFs, remove background with AI, compress images, and calculate financials in seconds.",
};

const tools = [
  {
    title: "AI Background Remover",
    description: "Instantly remove backgrounds from images with professional-grade AI precision.",
    href: "/background-remover",
    icon: Layers,
    category: "Image",
    badge: "AI Powered"
  },
  {
    title: "PDF to Image",
    description: "Convert PDF documents into high-quality PNG or JPG files page by page.",
    href: "/pdf-to-image",
    icon: FileText,
    category: "PDF",
    badge: "Popular"
  },
  {
    title: "Split PDF",
    description: "Extract specific page ranges or split single documents into multiple PDFs.",
    href: "/split-pdf",
    icon: Layers,
    category: "PDF"
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF documents into a single, perfectly structured file.",
    href: "/merge-pdf",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "Image Compressor",
    description: "Compress and optimize images (JPG, PNG, WebP) with zero quality loss.",
    href: "/image-compressor",
    icon: ImageIcon,
    category: "Image",
    badge: "Saves Space"
  },
  {
    title: "Markdown to PDF",
    description: "Write or upload Markdown files and convert them to beautifully formatted PDFs.",
    href: "/markdown-to-pdf",
    icon: FileCode,
    category: "PDF"
  },
  {
    title: "SIP Calculator",
    description: "Calculate compound returns and maturity wealth for monthly mutual fund plans.",
    href: "/sip-calculator",
    icon: PiggyBank,
    category: "Finance",
    badge: "Calculators"
  },
  {
    title: "Investment Calculator",
    description: "Project long-term compound interest growth based on capital and monthly contributions.",
    href: "/investment-calculator",
    icon: TrendingUp,
    category: "Finance"
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index and analyze healthy weight categories in seconds.",
    href: "/bmi-calculator",
    icon: Activity,
    category: "Health"
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, prettify, and minify complex JSON strings instantly.",
    href: "/json-formatter",
    icon: FileJson,
    category: "Developer",
    badge: "Formatter"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 overflow-hidden border-b bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-background">
          {/* Visual grid overlay */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="h-3.5 w-3.5" /> 100% Free, Secure & Online
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-500 dark:from-white dark:via-white dark:to-zinc-600 max-w-4xl mx-auto leading-[1.1]">
              Professional utilities. <br />
              <span className="text-primary italic font-serif">Simplified.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Say goodbye to premium subscriptions, cluttered interfaces, and fishy file conversions. Utilify gives you premium utility tools for completely free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <a href="#tools">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-all">
                  Launch Free Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-base font-bold border-zinc-200 dark:border-zinc-800">
                  Learn Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 bg-white dark:bg-background border-b border-zinc-100 dark:border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-zinc-50">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Everything runs client-side or on transient, secure servers. We never store or view your files.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-zinc-50">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Supercharged with Next.js and optimized backend code to process image and PDF conversions in milliseconds.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-zinc-50">AdSense Approved</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Built from the ground up for superior usability, clean layouts, and rich content - perfect for daily productive work.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
              Select Your Utility Tool
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Explore our suite of 10 professional utilities. Instantly available online with a clean layout and mobile-first design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => {
              const IconComp = tool.icon;
              return (
                <Link key={idx} href={tool.href} className="group">
                  <Card className="h-full border-2 border-zinc-100 hover:border-primary/30 dark:border-zinc-900 dark:hover:border-primary/20 bg-white dark:bg-zinc-950/40 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                    <CardHeader className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
                          <IconComp className="h-6 w-6" />
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0 flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                      Open Tool <ArrowRight className="h-4 w-4" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
