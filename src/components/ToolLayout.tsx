"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Card } from "@/components/ui/card";
import { AdBanner } from "./AdBanner";
import { CrossPromo } from "./CrossPromo";
import { JsonLd } from "./JsonLd";
import { blogPosts } from "@/lib/blog-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ArrowRight, Sparkles, Clock, Calendar } from "lucide-react";

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
  const currentSlug = pathname ? pathname.replace(/^\//, "") : "";

  // Dynamic automatic FAQPage Schema.org structured data
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Dynamic automatic HowTo Schema.org structured data
  const howToSchema = howToUse && howToUse.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use ${title}`,
    "description": description,
    "step": howToUse.map((item, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": item.step,
      "text": item.description,
    }))
  } : null;

  // Dynamic automatic BreadcrumbList Schema.org structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.theutilify.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": `https://www.theutilify.com/${currentSlug}`
      }
    ]
  };

  // Contextual related guides matching current tool category/topic
  const relatedGuides = blogPosts.filter(post => {
    const postSlug = post.slug.toLowerCase();
    const tool = currentSlug.toLowerCase();
    if (tool.includes("background") && postSlug.includes("background")) return true;
    if (tool.includes("image") && (postSlug.includes("image") || postSlug.includes("compression"))) return true;
    if (tool.includes("pdf") && postSlug.includes("pdf")) return true;
    if ((tool.includes("sip") || tool.includes("investment")) && (postSlug.includes("investing") || postSlug.includes("compound"))) return true;
    if ((tool.includes("json") || tool.includes("diff") || tool.includes("base64")) && (postSlug.includes("json") || postSlug.includes("developer"))) return true;
    return false;
  }).slice(0, 3);

  // Fallback to latest posts if no direct keyword match
  const displayGuides = relatedGuides.length > 0 ? relatedGuides : blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {faqSchema && <JsonLd data={faqSchema} />}
      {howToSchema && <JsonLd data={howToSchema} />}
      <JsonLd data={breadcrumbSchema} />
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

        {/* Contextual Hub-and-Spoke In-Depth Guides */}
        {displayGuides.length > 0 && (
          <section className="py-16 bg-muted/5 border-b">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-3">
                  <BookOpen className="h-3.5 w-3.5" /> Comprehensive Tutorials
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  In-Depth Guides & Walkthroughs
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Master advanced techniques, workflows, and industry best practices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayGuides.map((guide, idx) => (
                  <Link key={idx} href={`/blog/${guide.slug}`} className="group">
                    <div className="h-full p-6 rounded-2xl bg-card border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2.5 py-1 rounded-md bg-primary/10 inline-block mb-3">
                          {guide.category}
                        </span>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {guide.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>{guide.readTime}</span>
                        <span className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                          Read Guide <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Content: Related Tools */}
        <section className="py-12 flex flex-col items-center justify-center text-center">
          <div className="container max-w-4xl flex flex-col items-center justify-center text-center mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Related Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="px-4 py-2 rounded-full border bg-card hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


