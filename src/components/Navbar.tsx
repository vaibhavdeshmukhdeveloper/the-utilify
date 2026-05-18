"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, LayoutGrid, FileText, ImageIcon, Calculator, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      name: "PDF Tools",
      icon: FileText,
      items: [
        { name: "PDF to Image", href: "/pdf-to-image" },
        { name: "Split PDF", href: "/split-pdf" },
        { name: "Merge PDF", href: "/merge-pdf" },
        { name: "Markdown to PDF", href: "/markdown-to-pdf" },
      ]
    },
    {
      name: "Image Tools",
      icon: ImageIcon,
      items: [
        { name: "AI Background Remover", href: "/background-remover" },
        { name: "Image Compressor", href: "/image-compressor" },
      ]
    },
    {
      name: "Calculators",
      icon: Calculator,
      items: [
        { name: "SIP Calculator", href: "/sip-calculator" },
        { name: "Investment Calculator", href: "/investment-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-50 dark:to-zinc-300 group-hover:text-primary transition-colors">
                Utilify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* Quick Links */}
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            
            <a href="/#tools">
              <Button size="sm" className="rounded-xl shadow-md font-bold px-4 hover:shadow-lg transition-all">
                Explore Tools <LayoutGrid className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Blog Articles
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Contact Us
            </Link>
            
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <a href="/#tools" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 rounded-xl font-bold">
                  All Utilities <LayoutGrid className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
