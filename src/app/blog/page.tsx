import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productivity Blog - Utilify",
  description: "Read helpful guides, tutorials, and articles on image compression, PDF operations, finance calculators, and digital productivity tips.",
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Productivity & Finance Blog
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover tips, deep-dives, and guides on file management, investments, and simple online hacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...blogPosts]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((post, idx) => (
              <Link key={idx} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 rounded-[2rem] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <CardHeader className="p-8">
                    <div className="flex items-center gap-4 text-xs font-bold text-primary mb-4 uppercase tracking-wider">
                      <span>{post.category}</span>
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-0 mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-zinc-100 dark:border-zinc-900 pt-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-xs font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
