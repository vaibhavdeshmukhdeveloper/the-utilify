import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import UseCasesListClient from "./UseCasesListClient";

export const metadata: Metadata = {
  title: "Specialized Use Cases Directory - Utilify",
  description: "Browse our programmatic directory of specialized use cases. Safely convert, compress, remove backgrounds, and calculate complex financial SIP returns.",
};

export default function UseCasesDirectoryPage() {
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

          {/* Interactive Search & Filter Directory Grid */}
          <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading directory...</div>}>
            <UseCasesListClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
