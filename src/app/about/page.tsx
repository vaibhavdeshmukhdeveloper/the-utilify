import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Zap, Heart, Globe, Lock, Code, Terminal, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Us - Free Online Utilities Suite | Utilify",
  description: "Learn more about Utilify, our origin story from an IT engineer's personal master library, and our mission to provide free, privacy-first online tools for the world.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us - Free Online Utilities Suite | Utilify",
    description: "Learn more about Utilify, our origin story from an IT engineer's personal master library, and our mission to provide free, privacy-first online tools for the world.",
    url: "https://www.theutilify.com/about",
    siteName: "Utilify",
    type: "website",
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Utilify",
    "description": "The mission and architectural principles behind Utilify: privacy-first, zero-storage free online utilities.",
    "mainEntity": {
      "@type": "Organization",
      "name": "The Utilify Editorial Team",
      "url": "https://www.theutilify.com",
      "logo": "https://www.theutilify.com/icon.svg",
      "sameAs": [
        "https://github.com/vaibhavdeshmukhdeveloper/the-utilify"
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={aboutSchema} />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden border-b bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container px-4 md:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Built by Engineers for Everyone
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Our mission is to <br /><span className="text-primary italic">simplify your digital life.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build powerful, privacy-first online tools that help you get things done faster — without the clutter, paywalls, or privacy risks.
            </p>
          </div>
        </section>

        {/* Origin Story Section (Founder Background & Vision) */}
        <section className="py-20 border-b">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-wider mb-4">
                <Terminal className="h-5 w-5" />
                <span>The Story Behind Utilify</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-foreground">
                From a Personal Master Library to a Global Toolbox
              </h2>
              <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Coming from a background in IT and software engineering, our founder spent years working across complex tech stacks and everyday digital workflows. During that time, a recurring frustration became obvious: basic daily tasks — formatting a JSON payload, extracting pages from a PDF, compressing an image for deployment, calculating compound returns, or removing an image background — required juggling dozens of fragmented websites.
                </p>
                <p>
                  Most of those existing utility sites were cluttered with intrusive pop-up ads, throttled by slow load times, or locked behind aggressive paywalls. Even worse, many had questionable data storage policies where sensitive user files were saved onto unknown servers.
                </p>
                <p>
                  To solve this, he engineered a personal <strong>master library of utilities</strong> — a single, ultra-fast workspace combining high-performance client-side computation with transient in-memory cloud microservices.
                </p>
                <p className="text-foreground font-semibold">
                  Leveraging his IT background in modern full-stack development and cloud architecture, he decided not to keep this toolbox to himself. He polished, optimized, and published it online as <span className="text-primary font-bold">Utilify</span> — completely free and open for the entire world to use.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Cpu className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Zero File Retention</h4>
                    <p className="text-xs text-muted-foreground">Files processed in RAM and wiped immediately.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Client-Side First</h4>
                    <p className="text-xs text-muted-foreground">Calculators & formatters run directly in your browser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Always 100% Free</h4>
                    <p className="text-xs text-muted-foreground">No accounts, no subscriptions, no paywalled limits.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-8">What Sets Utilify Apart</h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                We believe standard web utilities should be lightning fast, beautifully designed, and respect your privacy by default.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">User-Centric Design</h3>
                  <p className="text-muted-foreground">Everything we build starts with the user experience. Clean typography, dark mode support, and fluid responsive interactions.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Privacy by Architecture</h3>
                  <p className="text-muted-foreground">We do not store your files on persistent hard disks. Cloud operations execute in transient memory and are discarded instantly.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Performance Driven</h3>
                  <p className="text-muted-foreground">Our microservice backend and client engines are optimized for speed, ensuring conversions and calculations finish in milliseconds.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Open Access</h3>
                  <p className="text-muted-foreground">The foundational utility of the web should be available to students, professionals, and creators everywhere without barriers.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Simplicity</h4>
                  <p className="text-sm text-muted-foreground">No visual noise or deceptive buttons. Just the exact tool you need.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Transparency</h4>
                  <p className="text-sm text-muted-foreground">Open architectural principles, clear privacy policies, and no hidden tracking.</p>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border text-center">
                  <h4 className="font-bold text-xl mb-4 text-primary">Quality</h4>
                  <p className="text-sm text-muted-foreground">Professional-grade fidelity, exact mathematical precision, and high-DPI output.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-8 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-6">Ready to get things done?</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Join thousands of users who rely on Utilify for their daily productivity and utility needs.
              No account required - just results.
            </p>
            <a href="/#tools">
              <button className="px-10 h-16 bg-white text-primary rounded-full text-lg font-bold hover:bg-zinc-100 transition-colors shadow-xl">
                Explore All Tools
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

