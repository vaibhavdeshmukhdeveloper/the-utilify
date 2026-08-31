"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { JsonLd } from "./JsonLd";
import { ArrowRight, Check, X, Sparkles, ShieldCheck, Zap, Lock, BookOpen } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

export interface ComparisonRow {
  feature: string;
  utilify: string | boolean;
  competitor: string | boolean;
  highlight?: boolean;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

interface ComparisonLayoutProps {
  competitorName: string;
  competitorSlug: string;
  headline: string;
  subheadline: string;
  targetToolName: string;
  targetToolHref: string;
  targetToolAction: string;
  tableRows: ComparisonRow[];
  faqs: ComparisonFaq[];
  detailedContent?: React.ReactNode;
}

export function ComparisonLayout({
  competitorName,
  competitorSlug,
  headline,
  subheadline,
  targetToolName,
  targetToolHref,
  targetToolAction,
  tableRows,
  faqs,
  detailedContent,
}: ComparisonLayoutProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.theutilify.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Alternatives & Comparisons",
        "item": "https://www.theutilify.com",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Utilify vs ${competitorName}`,
        "item": `https://www.theutilify.com/vs/${competitorSlug}`,
      },
    ],
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <Navbar />

      <main className="flex-grow">
        {/* Comparison Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden border-b bg-gradient-to-b from-card via-background to-background text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span>Comparisons</span>
              <span>/</span>
              <span className="text-foreground">Utilify vs {competitorName}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Free &amp; Modern Alternative to {competitorName}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
              {headline}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              {subheadline}
            </p>

            {/* Launch CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={targetToolHref}>
                <button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl hover:bg-primary/90 hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer">
                  {targetToolAction} <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/#tools">
                <button className="h-14 px-8 rounded-2xl bg-card border border-border/80 hover:bg-muted text-foreground font-bold text-base transition-all">
                  Explore All Utilities
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Side-by-Side Comparison Table */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              Feature &amp; Privacy Comparison
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              See why thousands of users choose The Utilify over {competitorName}.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground font-black">
                    <th className="py-5 px-6 sm:px-8">Feature / Metric</th>
                    <th className="py-5 px-6 sm:px-8 bg-primary/10 text-primary">
                      The Utilify Suite
                    </th>
                    <th className="py-5 px-6 sm:px-8">
                      {competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className={row.highlight ? "bg-primary/5 font-semibold" : "hover:bg-muted/20"}>
                      <td className="py-4 px-6 sm:px-8 text-foreground font-medium">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 sm:px-8 bg-primary/5 font-bold text-primary">
                        {typeof row.utilify === "boolean" ? (
                          row.utilify ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Check className="h-5 w-5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-red-500 font-bold">
                              <X className="h-5 w-5" /> No
                            </span>
                          )
                        ) : (
                          row.utilify
                        )}
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-muted-foreground">
                        {typeof row.competitor === "boolean" ? (
                          row.competitor ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-5 w-5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-red-500">
                              <X className="h-5 w-5" /> No
                            </span>
                          )
                        ) : (
                          row.competitor
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3 Value Pillars */}
        <section className="py-16 bg-muted/20 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-card border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Zero File Storage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unlike legacy platforms that retain user files on remote server disks, Utilify processes files transiently in RAM and deletes them immediately upon completion.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Daily Limits or Paywalls</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enjoy unlimited document manipulation and batch conversions with zero credit systems, zero download throttles, and zero subscription paywalls.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Zero Accounts &amp; Sign-Ups</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No sign-ups, no passwords to create, and no email spam. Land on any tool and start converting or calculating in one second.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Narrative Section */}
        {detailedContent && (
          <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-zinc dark:prose-invert">
            {detailedContent}
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Questions about transitioning from {competitorName} to Utilify.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-6 rounded-2xl bg-card border border-border/80 text-left">
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Launch Banner */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-t text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-foreground mb-4">Ready to switch to a cleaner, faster workflow?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm sm:text-base">
              Try {targetToolName} now with 100% privacy, zero file retention, and no accounts.
            </p>
            <Link href={targetToolHref}>
              <button className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 cursor-pointer">
                {targetToolAction} <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
