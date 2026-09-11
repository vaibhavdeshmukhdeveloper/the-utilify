"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { getLanguageFromPathname } from "@/lib/i18n/translations";
import { getUIStrings } from "@/lib/i18n/ui-strings";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/CommandPalette").then((m) => m.CommandPalette), {
  ssr: false,
});

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const pathname = usePathname();
  const currentLang = getLanguageFromPathname(pathname);
  const t = getUIStrings(currentLang);

  const homeHref = currentLang === "en" ? "/" : `/${currentLang}`;
  const toolsHref = currentLang === "en" ? "/#tools" : `/${currentLang}#tools`;

  useEffect(() => {
    const isMacPlatform = /(Mac|iPhone|iPod|iPad)/i.test(
      navigator.userAgent || navigator.platform || ""
    );
    setIsMac(isMacPlatform);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={homeHref} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Utilify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            <Link href={homeHref} className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              {t.nav.home}
            </Link>

            {/* Quick Links */}
            <div className="flex items-center space-x-5">
              <Link href="/about" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                {t.nav.about}
              </Link>
              <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                {t.nav.blog}
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                {t.nav.contact}
              </Link>
            </div>

            {/* Command Palette Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm select-none"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>{t.nav.searchPlaceholder}</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                {isMac ? (
                  <>
                    <span className="text-xs">⌘</span>K
                  </>
                ) : (
                  <span>Ctrl+K</span>
                )}
              </kbd>
            </button>

            <Link href={toolsHref}>
              <Button size="sm" className="rounded-xl shadow-md font-bold px-4 hover:shadow-lg transition-all">
                {t.nav.exploreTools} <LayoutGrid className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                {t.nav.switchLanguage}
              </span>
              <LanguageSwitcher variant="pills" />
            </div>

            <Link
              href={homeHref}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              {t.nav.blog}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              {t.nav.contact}
            </Link>

            <div className="pt-4 border-t">
              <Link href={toolsHref} onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 rounded-xl font-bold">
                  {t.nav.exploreTools} <LayoutGrid className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette Dialog */}
      <CommandPalette />
    </nav>
  );
}
