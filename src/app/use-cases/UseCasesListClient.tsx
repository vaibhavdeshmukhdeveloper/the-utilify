"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight, Search, X, Layers, FileText, PiggyBank, Activity, FileJson, Palette, Clock } from "lucide-react";
import { useCases } from "@/lib/use-cases-data";
import { useSearchParams } from "next/navigation";

const TOOL_NAMES: Record<string, string> = {
  "background-remover": "Background Remover",
  "pdf-to-image": "PDF to Image",
  "split-pdf": "Split PDF",
  "merge-pdf": "Merge PDF",
  "image-compressor": "Image Compressor",
  "markdown-to-pdf": "Markdown to PDF",
  "sip-calculator": "SIP Calculator",
  "investment-calculator": "Investment Calculator",
  "bmi-calculator": "BMI Calculator",
  "json-formatter": "JSON Formatter",
  "password-generator": "Password Generator",
  "qr-generator": "QR Generator",
  "text-converter": "Text Converter",
  "base64": "Base64 Encoder/Decoder",
  "color-palette": "Color Palette Generator",
  "date-calculator": "Date Calculator",
  "age-calculator": "Age Calculator",
  "unit-converter": "Unit Converter",
  "diff-checker": "Diff Checker",
  "lorem-ipsum": "Lorem Ipsum Generator",
  "word-counter": "Word Counter",
};

export default function UseCasesListClient() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "PDF", "Image", "Finance", "Health", "Developer", "Design", "Productivity"];

  // Set query or tool filter from URL search parameters on load
  useEffect(() => {
    const toolParam = searchParams?.get("tool");
    const searchParam = searchParams?.get("search");
    if (toolParam) {
      setSelectedTool(toolParam);
    }
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [searchParams]);

  // Focus search input when pressing "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Filter use cases based on active tool, category, and query
  const filteredUseCases = useCases.filter((uc) => {
    const matchesTool = !selectedTool || uc.baseTool === selectedTool;
    const matchesCategory = activeCategory === "All" || uc.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      uc.title.toLowerCase().includes(query.toLowerCase()) ||
      uc.seoTitle.toLowerCase().includes(query.toLowerCase()) ||
      uc.seoDescription.toLowerCase().includes(query.toLowerCase()) ||
      uc.heading.toLowerCase().includes(query.toLowerCase()) ||
      uc.introduction.toLowerCase().includes(query.toLowerCase()) ||
      uc.baseTool.replaceAll("-", " ").toLowerCase().includes(query.toLowerCase());

    return matchesTool && matchesCategory && matchesQuery;
  });

  const displayCategories = activeCategory === "All"
    ? categories.filter(c => c !== "All")
    : [activeCategory];

  return (
    <div className="space-y-12">
      {/* Search and Filters Controller */}
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {selectedTool && (
          <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Showing all <strong>{filteredUseCases.length} {TOOL_NAMES[selectedTool] || selectedTool}</strong> use cases</span>
            </div>
            <button
              onClick={() => setSelectedTool(null)}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Reset Tool Filter
            </button>
          </div>
        )}
        {/* Search Bar Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-center bg-white dark:bg-zinc-950/60 border-2 border-zinc-100 dark:border-zinc-900 rounded-2xl overflow-hidden focus-within:border-primary shadow-sm hover:shadow-md transition-all duration-300">
            <div className="pl-5 flex items-center justify-center text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search specialized use cases... (Press '/' to focus)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 px-4 bg-transparent outline-none text-base text-foreground placeholder-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-3 mr-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => {
            const isSelected = activeCategory === category;
            const IconComp = getCategoryIcon(category);

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]"
                    : "bg-white dark:bg-zinc-950/40 border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconComp className="h-4 w-4 shrink-0" />
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Directories */}
      <div className="space-y-16 pt-6">
        {filteredUseCases.length === 0 ? (
          <Card className="max-w-md mx-auto text-center p-12 border-2 border-dashed bg-card rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-muted text-muted-foreground rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">No use cases found</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              We couldn't find any specialized templates matching "{query}". Try checking other categories or clearing your search.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedTool(null);
                setActiveCategory("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-black uppercase tracking-wider transition-colors shadow-md"
            >
              Reset Filters
            </button>
          </Card>
        ) : (
          displayCategories.map((category) => {
            const items = filteredUseCases.filter((uc) => uc.category === category);
            if (items.length === 0) return null;
            const IconComp = getCategoryIcon(category);

            return (
              <div key={category} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
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
          })
        )}
      </div>
    </div>
  );
}
