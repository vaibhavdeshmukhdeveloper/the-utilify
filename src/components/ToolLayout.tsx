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
import { ArrowRight } from "lucide-react";

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
        {toolUseCases.length > 0 && (
          <section className="py-12 bg-muted/10 border-t flex flex-col items-center justify-center text-center">
            <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto px-4">
              <h2 className="text-2xl font-bold mb-2 text-center text-foreground">Specialized Use Cases</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Explore popular custom templates and calculations optimized for our {title} engine.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {visibleUseCases.map((uc, index) => (
                  <Link
                    key={index}
                    href={`/use-case/${uc.slug}`}
                    className="px-4 py-2 rounded-full border bg-card hover:bg-primary hover:text-primary-foreground hover:scale-[1.03] transition-all duration-200 text-sm font-medium"
                  >
                    {uc.title}
                  </Link>
                ))}
              </div>
              {hasMoreUseCases && (
                <Link
                  href={`/use-cases?search=${encodeURIComponent(title)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-black text-primary hover:underline transition-all duration-200"
                >
                  View all {toolUseCases.length} {title} use cases <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>
        )}

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
