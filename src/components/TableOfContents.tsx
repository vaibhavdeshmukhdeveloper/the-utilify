"use client";

import { useEffect, useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="mb-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-primary" /> Table of Contents ({headings.length} Sections)
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <nav className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-1.5 animate-in fade-in duration-200">
          {headings.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", `#${item.id}`);
                  }
                }}
                className={`block text-xs py-1 px-2.5 rounded-lg transition-all line-clamp-1 ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold translate-x-1"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="text-[10px] font-mono mr-1.5 opacity-60">{idx + 1}.</span>
                {item.text}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
