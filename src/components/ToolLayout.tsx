import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Card } from "@/components/ui/card";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  howToUse: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedTools: { name: string; href: string }[];
}

export function ToolLayout({
  children,
  title,
  description,
  howToUse,
  faqs,
  relatedTools,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Tool Header */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-950 border-b">
          <div className="container text-center max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {description}
            </p>
          </div>
        </section>

        {/* Tool Area */}
        <section className="py-12 md:py-20 flex-grow flex items-center">
          <div className="container">
            <Card className="p-6 md:p-12 lg:p-16 border-2 border-dashed bg-card/50 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center shadow-2xl shadow-primary/5 rounded-[2rem]">
              {children}
            </Card>
          </div>
        </section>

        {/* SEO Content: How to Use */}
        <section className="py-12 border-t">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use {title}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {howToUse.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{item.step}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content: FAQ */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-950 border-y">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-background border shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content: Related Tools */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Related Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, index) => (
                <a 
                  key={index} 
                  href={tool.href}
                  className="px-4 py-2 rounded-full border bg-zinc-50 hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
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
