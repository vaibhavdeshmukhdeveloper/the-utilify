"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { getLanguageFromPathname, getLocalizedPath, Language } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface LanguageOption {
  code: Language | "en";
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
];

interface LanguageSwitcherProps {
  variant?: "dropdown" | "pills";
  className?: string;
}

export function LanguageSwitcher({ variant = "dropdown", className }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";
  const currentLang = getLanguageFromPathname(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  if (variant === "pills") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border", className)}>
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === currentLang;
          const href = getLocalizedPath(pathname, lang.code);

          return (
            <Link
              key={lang.code}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>{lang.flag}</span>
              <span className="uppercase">{lang.code}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm select-none"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentOption.flag}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{currentOption.code}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-border/50 text-[10px] uppercase font-black tracking-wider text-muted-foreground">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === currentLang;
            const href = getLocalizedPath(pathname, lang.code);

            return (
              <Link
                key={lang.code}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
                  isActive && "text-primary font-bold bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
