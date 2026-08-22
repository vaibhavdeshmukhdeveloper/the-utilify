import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { marked } from "marked";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const publishedDate = new Date(post.date).toISOString();

  return {
    title: `${post.title} - Utilify Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} - Utilify Blog`,
      description: post.excerpt,
      url: `https://www.theutilify.com/blog/${slug}`,
      siteName: "Utilify",
      type: "article",
      publishedTime: publishedDate,
      authors: ["The Utilify Editorial Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Parse markdown asynchronously on the server
  const htmlContent = await marked(post.content.trim());
  const publishedDate = new Date(post.date).toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": publishedDate,
    "author": {
      "@type": "Organization",
      "name": "The Utilify Editorial Team",
      "url": "https://www.theutilify.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Utilify",
      "url": "https://www.theutilify.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.theutilify.com/icon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.theutilify.com/blog/${post.slug}`
    }
  };

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
        "name": "Blog",
        "item": "https://www.theutilify.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.theutilify.com/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <main className="flex-grow py-16 lg:py-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </nav>

          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>

          {/* Header */}
          <header className="mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-8 text-zinc-900 dark:text-zinc-50 leading-[1.15]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>{post.author || "The Utilify Editorial Team"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-[1.8] space-y-6 mb-16"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Interactive Tool Banner Callout */}
          <div className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-primary tracking-wider mb-2">
                <Sparkles className="h-4 w-4" /> Instant Online Tool
              </div>
              <h4 className="text-xl font-black text-foreground">Ready to try our free utilities?</h4>
              <p className="text-sm text-muted-foreground mt-1">100% free, browser-first, zero file retention.</p>
            </div>
            <Link href="/#tools" className="shrink-0">
              <button className="px-6 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                Explore All Tools <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Author / Editorial Team Box (E-E-A-T) */}
          <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground">Written & Reviewed by The Utilify Editorial Team</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our guides, formulas, and tutorials are written and maintained by software engineers committed to building privacy-first web utilities and open-access productivity solutions.
              </p>
              <div className="pt-2">
                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline">
                  Learn more about our mission & story <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}


