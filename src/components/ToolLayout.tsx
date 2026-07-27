"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { AdBanner } from "./AdBanner";
import { CrossPromo } from "./CrossPromo";
import { useCases } from "@/lib/use-cases-data";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  howToUse: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedTools: { name: string; href: string }[];
  detailedContent?: React.ReactNode;
}

export function ToolLayout({
  children,
  title,
  description,
  howToUse,
  faqs,
  relatedTools,
  detailedContent,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const isUseCase = pathname?.startsWith("/use-case/");
  
  // Extract the base tool slug (e.g. "/background-remover" -> "background-remover")
  const toolSlug = pathname ? pathname.replace(/^\//, "") : "";
  
  // Find related use cases for this parent tool
  const toolUseCases = useCases.filter((uc) => uc.baseTool === toolSlug);
  const visibleUseCases = toolUseCases.slice(0, 6);
  const hasMoreUseCases = toolUseCases.length > 6;

  if (isUseCase) {
    return (
      <div className="w-full flex items-center justify-center text-center">
        <div className="w-full flex flex-col items-center justify-center text-center mx-auto">
          <Card className="w-full p-6 md:p-12 lg:p-16 border-2 border-dashed bg-card backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center shadow-2xl shadow-primary/5 rounded-[2rem] text-center">
            {children}
          </Card>
          <CrossPromo />
          <AdBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Tool Header */}
        <section className="py-12 bg-card border-b flex flex-col items-center justify-center text-center">
          <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-foreground text-center">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground text-center">
              {description}
            </p>
          </div>
        </section>

        {/* Tool Area */}
        <section className="py-12 md:py-20 flex-grow flex items-center justify-center text-center">
          <div className="container flex flex-col items-center justify-center text-center mx-auto px-4">
            <Card className="w-full p-6 md:p-12 lg:p-16 border-2 border-dashed bg-card backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center shadow-2xl shadow-primary/5 rounded-[2rem] text-center">
              {children}
            </Card>
            <CrossPromo />
            <AdBanner />
          </div>
        </section>

        {/* Detailed Guide Content */}
        {detailedContent && (
          <section className="py-16 bg-muted/10 border-t flex flex-col items-center justify-center text-left">
            <div className="container max-w-4xl px-6 mx-auto prose prose-zinc dark:prose-invert">
              {detailedContent}
            </div>
          </section>
        )}

        {/* SEO Content: How to Use */}
        <section className="py-12 border-t flex flex-col items-center justify-center text-center">
          <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">How to Use {title}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {howToUse.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content: FAQ */}
        <section className="py-12 bg-card border-y flex flex-col items-center justify-center text-center">
          <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-6 w-full">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-background border shadow-sm text-center">
                  <h3 className="font-bold text-lg mb-2 text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content: Specialized Use Cases */}
        {toolUseCases.length > 0 && (() => {
          const sortedUseCases = [...toolUseCases].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });
          const visibleUseCases = sortedUseCases.slice(0, 6);
          const hasMoreUseCases = toolUseCases.length > 6;

          return (
            <section className="py-16 bg-muted/10 border-t flex flex-col items-center justify-center">
              <div className="container max-w-6xl flex flex-col items-center justify-center text-center mx-auto px-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-3">
                  <Sparkles className="h-3.5 w-3.5" /> Popular Templates & Solutions
                </div>
                <h2 className="text-3xl font-extrabold mb-3 text-center text-foreground">
                  Specialized {title} Use Cases
                </h2>
                <p className="text-base text-muted-foreground mb-10 max-w-xl mx-auto font-medium">
                  Explore real-world examples, custom presets, and specialized workflows optimized for our {title} engine.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left w-full mb-10">
                  {visibleUseCases.map((uc, index) => (
                    <Link
                      key={index}
                      href={`/use-case/${uc.slug}`}
                      className="group relative bg-card dark:bg-zinc-900/60 border-2 border-zinc-100 dark:border-zinc-800/80 hover:border-primary/40 dark:hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-bold text-[11px] uppercase tracking-wider">
                            {uc.category}
                          </span>
                          {uc.featured && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-full">
                              <Sparkles className="h-3 w-3" /> Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                          {uc.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium mb-4">
                          {uc.seoDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-primary">
                        <span>Explore Use Case</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMoreUseCases && (
                  <Link
                    href={`/use-cases?tool=${encodeURIComponent(toolSlug)}`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200"
                  >
                    View all {toolUseCases.length} {title} use cases <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </section>
          );
        })()}

        {/* SEO Content: Related Tools */}
        <section className="py-12 flex flex-col items-center justify-center text-center">
          <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Related Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, index) => (
                <a
                  key={index}
                  href={tool.href}
                  className="px-4 py-2 rounded-full border bg-card hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
