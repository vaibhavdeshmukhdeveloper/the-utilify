import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} - Utilify Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Parse custom Markdown paragraphs for simple rendering
  const paragraphs = post.content.trim().split("\n\n");

  // Helper to parse bold text (**text**)
  const parseBoldText = (text: string): React.ReactNode[] => {
    const parts = text.split("**");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-zinc-950 dark:text-zinc-50">{part}</strong>;
      }
      return part;
    });
  };

  // Helper to parse links and bold text within a string
  const parseMarkdownInline = (text: string): React.ReactNode[] => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = Array.from(text.matchAll(linkRegex));

    if (matches.length === 0) {
      return parseBoldText(text);
    }

    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    matches.forEach((match, matchIdx) => {
      const linkText = match[1];
      const url = match[2];
      const index = match.index!;

      parts.push(...parseBoldText(text.substring(lastIndex, index)));
      parts.push(
        <Link key={matchIdx} href={url} className="text-primary font-bold hover:underline">
          {parseBoldText(linkText)}
        </Link>
      );
      lastIndex = index + match[0].length;
    });

    parts.push(...parseBoldText(text.substring(lastIndex)));
    return parts;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-16 lg:py-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-12">
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
          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-[1.8] space-y-6">
            {paragraphs.map((p, idx) => {
              if (p.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mt-10 mb-4">
                    {parseMarkdownInline(p.replace("### ", ""))}
                  </h3>
                );
              }
              if (p.startsWith("- ")) {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 my-6">
                    {p.split("\n")
                      .map(li => li.trim())
                      .filter(Boolean)
                      .map((li, liIdx) => (
                        <li key={liIdx}>{parseMarkdownInline(li.replace("- ", ""))}</li>
                      ))}
                  </ul>
                );
              }

              return <p key={idx}>{parseMarkdownInline(p)}</p>;
            })}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
