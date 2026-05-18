"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Pitch */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/10">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Utilify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast, elegant, and 100% secure online utilities designed to simplify your digital life. No signups, no fees - just instant results.
            </p>
          </div>

          {/* Column 2: Tool categories */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-wider uppercase mb-4">
              Heavy Processing
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/background-remover" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Background Remover
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-image" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PDF to Image Converter
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/markdown-to-pdf" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Markdown to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Utilities */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-wider uppercase mb-4">
              Calculators & Formatting
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/sip-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link href="/investment-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Investment Calculator
                </Link>
              </li>
              <li>
                <Link href="/bmi-calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/json-formatter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  JSON Formatter & Validator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Links & Support */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} Utilify. All rights reserved. Made with <Heart className="inline-block h-3.5 w-3.5 text-red-500 fill-red-500" /> for a simpler web.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
