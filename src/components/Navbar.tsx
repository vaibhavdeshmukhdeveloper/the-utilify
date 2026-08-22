"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Utilify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>

            {/* Quick Links */}
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>

            {/* Command Palette Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm select-none"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span>⌘</span>K
              </kbd>
            </button>

            <Link href="/#tools">
              <Button size="sm" className="rounded-xl shadow-md font-bold px-4 hover:shadow-lg transition-all">
                Explore Tools <LayoutGrid className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none transition-all"
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
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              Blog Articles
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-foreground hover:bg-accent transition-colors"
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t">
              <Link href="/#tools" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 rounded-xl font-bold">
                  All Utilities <LayoutGrid className="ml-2 h-5 w-5" />
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
