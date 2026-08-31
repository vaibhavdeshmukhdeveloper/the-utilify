"use client";

import { ToolCard } from "@/components/ToolCard";
import { 
  FileJson, 
  FileText, 
  Layers, 
  Calculator,
  TrendingUp,
  PiggyBank,
  Key,
  QrCode,
  Type,
  Binary,
  Palette,
  Calendar,
  Hourglass,
  Ruler,
  GitCompare,
  AlignLeft,
  Search,
  X,
  History,
  Activity,
  Star,
  Flame,
  Image as ImageIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "sonner";

const allTools = [
  {
    title: "AI Background Remover",
    description: "Remove image backgrounds automatically using professional-grade AI.",
    href: "/background-remover",
    icon: Layers,
    category: "Image",
    popular: true
  },
  {
    title: "Image Compressor",
    description: "Reduce image file size with zero quality loss.",
    href: "/image-compressor",
    icon: ImageIcon,
    category: "Image"
  },
  {
    title: "Color Palette Generator",
    description: "Generate random or custom palettes and test contrast against WCAG standards.",
    href: "/color-palette",
    icon: Palette,
    category: "Image"
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages into high-quality JPG or PNG images.",
    href: "/pdf-to-image",
    icon: FileText,
    category: "PDF",
    popular: true
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole range for easy conversion.",
    href: "/split-pdf",
    icon: Layers,
    category: "PDF"
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into a single document.",
    href: "/merge-pdf",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "Markdown to PDF",
    description: "Convert Markdown text or files into clean PDF documents.",
    href: "/markdown-to-pdf",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "SIP Calculator",
    description: "Estimate the future value of your monthly investments.",
    href: "/sip-calculator",
    icon: PiggyBank,
    category: "Finance"
  },
  {
    title: "Investment Calculator",
    description: "Project your future wealth with compound interest.",
    href: "/investment-calculator",
    icon: TrendingUp,
    category: "Finance"
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) instantly.",
    href: "/bmi-calculator",
    icon: Activity,
    category: "Health"
  },
  {
    title: "JSON Formatter",
    description: "Pretty-print, validate and minify JSON data instantly.",
    href: "/json-formatter",
    icon: FileJson,
    category: "Developer"
  },
  {
    title: "Password Generator",
    description: "Generate highly secure, strong random passwords client-side.",
    href: "/password-generator",
    icon: Key,
    category: "Developer",
    popular: true
  },
  {
    title: "QR Code Generator",
    description: "Create custom high-quality QR codes for links and text.",
    href: "/qr-generator",
    icon: QrCode,
    category: "Developer"
  },
  {
    title: "Word Counter",
    description: "Count words, characters, reading time, and social media limits live.",
    href: "/word-counter",
    icon: FileText,
    category: "Utility",
    popular: true
  },
  {
    title: "Text Case Converter",
    description: "Convert texts to UPPER, lower, Title, or sentence case.",
    href: "/text-converter",
    icon: Type,
    category: "Developer"
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Convert plain text or files to Base64 format and vice versa.",
    href: "/base64",
    icon: Binary,
    category: "Developer"
  },
  {
    title: "Diff Checker",
    description: "Compare two chunks of text side-by-side to highlight differences.",
    href: "/diff-checker",
    icon: GitCompare,
    category: "Developer"
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate custom placeholder text in paragraphs or words.",
    href: "/lorem-ipsum",
    icon: AlignLeft,
    category: "Developer"
  },
  {
    title: "Date Calculator",
    description: "Calculate duration between dates or add/subtract time.",
    href: "/date-calculator",
    icon: Calendar,
    category: "Utility"
  },
  {
    title: "Age Calculator",
    description: "Check your exact age and countdown your next birthday.",
    href: "/age-calculator",
    icon: Hourglass,
    category: "Utility"
  },
  {
    title: "Unit Converter",
    description: "Convert length, weight, area, volume, and temperature.",
    href: "/unit-converter",
    icon: Ruler,
    category: "Utility",
    popular: true
  },
  {
    title: "FIRE Calculator",
    description: "Calculate your Financial Independence number and retirement timeline using the 4% rule.",
    href: "/fire-calculator",
    icon: Flame,
    category: "Finance",
    popular: true
  },
  {
    title: "PX to REM Converter",
    description: "Convert pixel values to REM/EM and generate responsive CSS clamp() typography.",
    href: "/px-to-rem",
    icon: Type,
    category: "Developer"
  },
  {
    title: "Compress PNG",
    description: "Shrink transparent PNG images with lossless compression.",
    href: "/compress-png",
    icon: ImageIcon,
    category: "Image"
  },
  {
    title: "Compress JPEG",
    description: "Reduce JPG photo file sizes by up to 85% without quality loss.",
    href: "/compress-jpeg",
    icon: ImageIcon,
    category: "Image"
  },
  {
    title: "Make Signature Transparent",
    description: "Extract ink signatures from paper photos for PDF and document signing.",
    href: "/make-signature-transparent",
    icon: Layers,
    category: "Image"
  },
  {
    title: "White Background Photos",
    description: "Convert product photos to pure studio-white (#FFFFFF) for Amazon and Shopify.",
    href: "/white-background-product-photos",
    icon: Palette,
    category: "Image"
  }
];


export function ToolsGrid() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [recentTools, setRecentTools] = useState<typeof allTools>([]);
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "PDF", "Image", "Developer", "Finance", "Health", "Utility"];

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

  // Fetch recently used and pinned tools from localStorage
  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem("utilify-recent-tools");
      if (storedRecent) {
        const parsed = JSON.parse(storedRecent) as string[];
        const matched = parsed
          .map((href) => allTools.find((t) => t.href === href))
          .filter((t): t is typeof allTools[0] => !!t);
        setRecentTools(matched);
      }

      const storedPinned = localStorage.getItem("utilify-pinned-tools");
      if (storedPinned) {
        setPinnedHrefs(JSON.parse(storedPinned));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRecentClick = (href: string) => {
    try {
      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem("utilify-recent-tools");
      setRecentTools([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePin = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isPinned = pinnedHrefs.includes(href);
      let updated: string[];
      if (isPinned) {
        updated = pinnedHrefs.filter((h) => h !== href);
        toast.info("Unpinned from favorites");
      } else {
        updated = [...pinnedHrefs, href];
        triggerConfetti();
        toast.success("Pinned to favorites!");
      }
      setPinnedHrefs(updated);
      localStorage.setItem("utilify-pinned-tools", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter tools based on search query and category active tab
  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = filter === "All" || tool.category === filter;
    const text = (tool.title + " " + tool.description + " " + tool.category).toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedTools = allTools.filter((tool) => pinnedHrefs.includes(tool.href));

  return (
    <section id="tools" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search & Categories Panel */}
      <div className="flex flex-col gap-8 mb-16">
        {/* Search Bar Input */}
        <div className="w-full max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center bg-card border border-border/80 rounded-2xl shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all h-14 px-5">
            <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
            <input
              ref={searchInputRef}
              type="text"
              className="flex-grow bg-transparent border-none outline-none text-foreground font-bold placeholder:text-muted-foreground placeholder:font-semibold text-base"
              placeholder="Search utility tools... (Press '/' to focus)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              /
            </kbd>
          </div>
        </div>

        {/* Categories Select Tab Row */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-muted/40 dark:bg-zinc-900/30 border border-border/40 rounded-2xl max-w-3xl mx-auto">
          {categories.map((cat) => (
            <Button 
              key={cat}
              variant={filter === cat ? "default" : "ghost"} 
              size="sm"
              onClick={() => setFilter(cat)}
              className="rounded-xl px-5 py-2 font-bold text-sm transition-all"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Pinned / Favorites Section */}
      {pinnedTools.length > 0 && !query && filter === "All" && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" /> Pinned Favorites
            </h3>
            <span className="text-xs text-muted-foreground font-semibold">
              {pinnedTools.length} {pinnedTools.length === 1 ? "tool" : "tools"} pinned
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pinnedTools.map((tool) => {
              return (
                <div key={tool.href} onClick={() => handleRecentClick(tool.href)}>
                  <ToolCard
                    {...tool}
                    isPinned={true}
                    onTogglePin={handleTogglePin}
                  />
                </div>
              );
            })}
          </div>
          <div className="border-b border-border/60 pt-12" />
        </div>
      )}

      {/* Recently Visited Tools Section */}
      {recentTools.length > 0 && !query && filter === "All" && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <History className="h-5 w-5" /> Jump Back In
            </h3>
            <button 
              onClick={clearRecent}
              className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              Clear History
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentTools.map((tool) => {
              return (
                <div key={tool.href} onClick={() => handleRecentClick(tool.href)}>
                  <ToolCard
                    {...tool}
                    isPinned={pinnedHrefs.includes(tool.href)}
                    onTogglePin={handleTogglePin}
                  />
                </div>
              );
            })}
          </div>
          <div className="border-b border-border/60 pt-12" />
        </div>
      )}

      {/* Main Tools Grid */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            {filter} Utilities
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border">
            {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} found
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <div key={tool.href} onClick={() => handleRecentClick(tool.href)}>
                <ToolCard
                  {...tool}
                  isPinned={pinnedHrefs.includes(tool.href)}
                  onTogglePin={handleTogglePin}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed rounded-[2rem] bg-card/25 border-border">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
            <h4 className="text-lg font-bold text-foreground mb-1">No tools matched</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              We couldn't find any utilities matching your keyword or category selection. Try revising your query.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
