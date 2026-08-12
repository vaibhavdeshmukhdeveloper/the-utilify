"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  History, 
  X,
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
  Activity,
  Image as ImageIcon
} from "lucide-react";

// List of all tools matching the pages
const toolsList = [
  {
    title: "AI Background Remover",
    description: "Remove image backgrounds automatically using professional-grade AI.",
    href: "/background-remover",
    icon: Layers,
    category: "Image"
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
    description: "Convert PDF pages into high-resolution JPG or PNG image files.",
    href: "/pdf-to-image",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "Split PDF",
    description: "Extract specific page ranges or pages into separate PDFs.",
    href: "/split-pdf",
    icon: Layers,
    category: "PDF"
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files sequentially into a single file.",
    href: "/merge-pdf",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "Markdown to PDF",
    description: "Compile Markdown text or files into professionally formatted PDFs.",
    href: "/markdown-to-pdf",
    icon: FileText,
    category: "PDF"
  },
  {
    title: "SIP Calculator",
    description: "Calculate potential growth and maturity wealth for monthly SIP investments.",
    href: "/sip-calculator",
    icon: PiggyBank,
    category: "Finance"
  },
  {
    title: "Investment Calculator",
    description: "Project future compound growth based on capital and contributions.",
    href: "/investment-calculator",
    icon: TrendingUp,
    category: "Finance"
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) and healthy weight suggestions.",
    href: "/bmi-calculator",
    icon: Activity,
    category: "Health"
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, prettify, and minify JSON data instantly.",
    href: "/json-formatter",
    icon: FileJson,
    category: "Developer"
  },
  {
    title: "Password Generator",
    description: "Generate highly secure, strong random passwords client-side.",
    href: "/password-generator",
    icon: Key,
    category: "Developer"
  },
  {
    title: "QR Code Generator",
    description: "Create custom QR codes for links, text, emails, or Wi-Fi networks.",
    href: "/qr-generator",
    icon: QrCode,
    category: "Developer"
  },
  {
    title: "Word Counter",
    description: "Count words, characters, reading time, and social media limits live.",
    href: "/word-counter",
    icon: FileText,
    category: "Utility"
  },
  {
    title: "Text Case Converter",
    description: "Convert texts between UPPER, lower, Title, or sentence case.",
    href: "/text-converter",
    icon: Type,
    category: "Developer"
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Convert plain text or binary files to Base64 format and vice versa.",
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
    description: "Generate customizable placeholder text in paragraphs or words.",
    href: "/lorem-ipsum",
    icon: AlignLeft,
    category: "Developer"
  },
  {
    title: "Date Calculator",
    description: "Calculate duration between dates or add/subtract time intervals.",
    href: "/date-calculator",
    icon: Calendar,
    category: "Utility"
  },
  {
    title: "Age Calculator",
    description: "Determine exact age and track next birthday countdown.",
    href: "/age-calculator",
    icon: Hourglass,
    category: "Utility"
  },
  {
    title: "Unit Converter",
    description: "Convert length, weight, area, volume, and temperature measurements.",
    href: "/unit-converter",
    icon: Ruler,
    category: "Utility"
  }
];


export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentTools, setRecentTools] = useState<typeof toolsList>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to the custom event triggered by clicking navbar search buttons
  useEffect(() => {
    const handleCustomOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => window.removeEventListener("open-command-palette", handleCustomOpen);
  }, []);

  // Load recently used tools from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("utilify-recent-tools");
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          const matched = parsed
            .map((href) => toolsList.find((t) => t.href === href))
            .filter((t): t is typeof toolsList[0] => !!t);
          setRecentTools(matched);
        }
      } catch (err) {
        console.error("Error reading recent tools", err);
      }
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle results filtering
  const filtered = query.trim() === "" 
    ? recentTools.length > 0 ? recentTools : toolsList.slice(0, 5) 
    : toolsList.filter((tool) => {
        const text = (tool.title + " " + tool.description + " " + tool.category).toLowerCase();
        return text.includes(query.toLowerCase());
      });

  // Navigate options via arrows and enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        selectTool(filtered[activeIndex].href);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const selectTool = (href: string) => {
    try {
      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
    
    setIsOpen(false);
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={modalRef} 
        className="w-full max-w-2xl bg-card border border-border/85 rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden flex flex-col max-h-[75vh] mx-4 animate-in slide-in-from-top-4 duration-300"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-4 px-6 border-b border-border/80 h-16 bg-muted/20">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none font-bold text-foreground placeholder:text-muted-foreground placeholder:font-semibold text-lg"
            placeholder="Type to search utility tools..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-black text-muted-foreground select-none">
              ESC
            </span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {query.trim() === "" && recentTools.length > 0 && (
            <div className="px-3 pt-2 pb-1 text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" /> Recently Used
            </div>
          )}

          {query.trim() === "" && recentTools.length === 0 && (
            <div className="px-3 pt-2 pb-1 text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Popular Tools
            </div>
          )}

          {filtered.length > 0 ? (
            filtered.map((tool, idx) => {
              const IconComp = tool.icon;
              const isActive = idx === activeIndex;
              return (
                <div
                  key={tool.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 -translate-y-0.5 scale-[1.01]" 
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground"
                  }`}
                  onClick={() => selectTool(tool.href)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold truncate text-base">{tool.title}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                      }`}>
                        {tool.category}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${isActive ? "text-white/80" : "text-muted-foreground"}`}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm font-semibold">
              No tools matched your search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
