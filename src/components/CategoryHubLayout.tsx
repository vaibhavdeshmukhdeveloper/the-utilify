"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { JsonLd } from "./JsonLd";
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  FileText, 
  Layers, 
  FileCode, 
  Image as ImageIcon, 
  Palette, 
  FileJson, 
  Key, 
  QrCode, 
  Binary, 
  GitCompare, 
  AlignLeft, 
  Type, 
  PiggyBank, 
  TrendingUp, 
  Activity, 
  Hourglass, 
  Calendar, 
  Ruler, 
  LucideIcon 
} from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

const iconMap: Record<string, LucideIcon> = {
  "/merge-pdf": FileText,
  "/split-pdf": Layers,
  "/pdf-to-image": FileText,
  "/markdown-to-pdf": FileCode,
  "/background-remover": Layers,
  "/image-compressor": ImageIcon,
  "/color-palette": Palette,
  "/json-formatter": FileJson,
  "/password-generator": Key,
  "/qr-generator": QrCode,
  "/base64": Binary,
  "/diff-checker": GitCompare,
  "/text-converter": Type,
  "/lorem-ipsum": AlignLeft,
  "/sip-calculator": PiggyBank,
  "/investment-calculator": TrendingUp,
  "/bmi-calculator": Activity,
  "/age-calculator": Hourglass,
  "/date-calculator": Calendar,
  "/unit-converter": Ruler,
  "/word-counter": FileText,
};

export interface CategoryToolItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  features: string[];
}

export interface CategoryFaqItem {
  question: string;
  answer: string;
}

interface CategoryHubLayoutProps {
  categoryName: string;
  categorySlug: string;
  headline: string;
  subheadline: string;
  description: string;
  tools: CategoryToolItem[];
  faqs: CategoryFaqItem[];
  detailedContent?: React.ReactNode;
}

export function CategoryHubLayout({
  categoryName,
  categorySlug,
  headline,
  subheadline,
  description,
  tools,
  faqs,
  detailedContent,
}: CategoryHubLayoutProps) {
  // Schema.org CollectionPage & ItemList
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - The Utilify Suite`,
    "description": description,
    "url": `https://www.theutilify.com/category/${categorySlug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": tool.title,
        "url": `https://www.theutilify.com${tool.href}`,
        "description": tool.description,
      })),
    },
  };

  // Schema.org Breadcrumbs
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
        "name": "Categories",
        "item": "https://www.theutilify.com/#tools",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `https://www.theutilify.com/category/${categorySlug}`,
      },
    ],
  };

  // Schema.org FAQPage
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

  // Filter contextual blogs related to category
  const relevantBlogs = blogPosts.filter((post) => {
    const cat = post.category.toLowerCase();
    const slug = categorySlug.toLowerCase();
    if (slug.includes("pdf") && (cat.includes("pdf") || cat.includes("productivity") || cat.includes("security"))) return true;
    if (slug.includes("image") && (cat.includes("design") || cat.includes("image"))) return true;
    if (slug.includes("finance") && cat.includes("finance")) return true;
    if (slug.includes("developer") && (cat.includes("development") || cat.includes("productivity"))) return true;
    return false;
  }).slice(0, 3);

  const displayBlogs = relevantBlogs.length > 0 ? relevantBlogs : blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <Navbar />

      <main className="flex-grow">
        {/* Category Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden border-b bg-gradient-to-b from-card to-background text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#tools" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span>/</span>
              <span className="text-foreground">{categoryName}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" /> 100% Free &amp; Privacy-First Utilities
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
              {headline}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {subheadline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No Sign-Up Required
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero File Retention
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited Free Runs
              </span>
            </div>
          </div>
        </section>

        {/* Featured Tools Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Available {categoryName}
            </h2>
            <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">
              Select an interactive tool below to start processing immediately in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, idx) => {
              const Icon = iconMap[tool.href] || FileText;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/15 to-primary/5 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7" />
                      </div>
                      {tool.badge && (
                        <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {tool.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={tool.href} className="w-full">
                    <button className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
                      Launch {tool.title} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed SEO Explanatory Section */}
        {detailedContent && (
          <section className="py-16 bg-muted/20 border-y">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-zinc dark:prose-invert">
              {detailedContent}
            </div>
          </section>
        )}

        {/* Category FAQs */}
        {faqs.length > 0 && (
          <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Everything you need to know about using our {categoryName.toLowerCase()}.
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

        {/* Contextual In-Depth Guides */}
        {displayBlogs.length > 0 && (
          <section className="py-16 bg-muted/10 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-3">
                  <BookOpen className="h-3.5 w-3.5" /> Educational Guides
                </div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Related Tutorials &amp; Walkthroughs
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayBlogs.map((post, bIdx) => (
                  <Link key={bIdx} href={`/blog/${post.slug}`} className="group">
                    <div className="h-full p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2 py-0.5 rounded-md bg-primary/10 inline-block mb-3">
                          {post.category}
                        </span>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <span>{post.readTime}</span>
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

        {/* Browse Other Category Hubs */}
        <section className="py-16 border-t text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Explore Other Utility Categories</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/category/pdf-tools" className="px-5 py-2.5 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold">
                PDF &amp; Documents
              </Link>
              <Link href="/category/image-tools" className="px-5 py-2.5 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold">
                Image &amp; Media Tools
              </Link>
              <Link href="/category/developer-tools" className="px-5 py-2.5 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold">
                Developer Utilities
              </Link>
              <Link href="/category/financial-calculators" className="px-5 py-2.5 rounded-xl border bg-card hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold">
                Finance &amp; Calculators
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
