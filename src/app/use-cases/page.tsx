import { useCases } from "@/lib/use-cases-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight, Layers, FileText, PiggyBank, Activity, FileJson, Palette, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialized Use Cases Directory - Utilify",
  description: "Browse our programmatic directory of specialized use cases. Safely convert, compress, remove backgrounds, and calculate complex financial SIP returns.",
};

export default function UseCasesDirectoryPage() {
  // Group use cases by category
  const categories = ["PDF", "Image", "Finance", "Health", "Developer", "Design", "Productivity"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "PDF":
        return FileText;
      case "Image":
        return Layers;
      case "Finance":
        return PiggyBank;
      case "Health":
        return Activity;
      case "Developer":
        return FileJson;
      case "Design":
        return Palette;
      case "Productivity":
        return Clock;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" /> Programmatic Index
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-foreground leading-[1.1]">
              Specialized Use Cases
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto">
              Explore our curated suite of hyper-niche, task-specific utilities. Built for speed, precision, and complete user privacy.
            </p>
          </div>

          {/* Categorized Directories */}
          <div className="space-y-16">
            {categories.map((category) => {
              const items = useCases.filter((uc) => uc.category === category);
              if (items.length === 0) return null;
              const IconComp = getCategoryIcon(category);

              return (
                <div key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                      {category} Use Cases
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-2">
                      {items.length} use cases
                    </span>
                  </div>

                  {/* Use Case Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((uc, idx) => (
                      <Link key={idx} href={`/use-case/${uc.slug}`} className="group">
                        <Card className="h-full border-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 rounded-[2rem] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                          <CardHeader className="p-8">
                            <div className="flex justify-between items-start mb-6">
                              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                                {category}
                              </span>
                              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0" />
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors leading-snug">
                              {uc.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {uc.seoDescription}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
