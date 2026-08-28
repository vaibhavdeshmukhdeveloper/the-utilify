import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";
import { BlogListingClient } from "@/components/BlogListingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productivity & Tech Blog - Free Online Guides | Utilify",
  description: "Read in-depth guides, tutorials, and practical formulas on image compression, PDF manipulation, developer utilities, and personal finance.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Productivity & Tech Blog - Free Online Guides | Utilify",
    description: "Read in-depth guides, tutorials, and practical formulas on image compression, PDF manipulation, developer utilities, and personal finance.",
    url: "https://www.theutilify.com/blog",
  },
};

export default function BlogListingPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-4">
              Knowledge Base & Tutorials
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-foreground">
              Productivity & Engineering Blog
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In-depth guides, mathematical formulas, and step-by-step tutorials for developers, designers, and creators.
            </p>
          </div>

          {/* Interactive Search, Category Filters, and Paginated Grid */}
          <BlogListingClient posts={sortedPosts} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
