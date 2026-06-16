"use client";

import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "text-sm text-primary font-bold hover:underline transition-colors"
      : "text-sm text-muted-foreground hover:text-primary transition-colors";
  };

  return (
    <footer className="border-t bg-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Logo & Pitch */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/10">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">
                Utilify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast, elegant, and 100% secure online utilities designed to simplify your digital life. No signups, no fees - just instant results.
            </p>
          </div>

          {/* Column 2: PDF & Image Tools */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              PDF & Image Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/background-remover" className={getLinkClass("/background-remover")}>
                  AI Background Remover
                </Link>
              </li>
              <li>
                <Link href="/image-compressor" className={getLinkClass("/image-compressor")}>
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-image" className={getLinkClass("/pdf-to-image")}>
                  PDF to Image
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className={getLinkClass("/split-pdf")}>
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/merge-pdf" className={getLinkClass("/merge-pdf")}>
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/markdown-to-pdf" className={getLinkClass("/markdown-to-pdf")}>
                  Markdown to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developer & Text Tools */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              Developer & Text
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/json-formatter" className={getLinkClass("/json-formatter")}>
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/password-generator" className={getLinkClass("/password-generator")}>
                  Password Generator
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className={getLinkClass("/qr-generator")}>
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/base64" className={getLinkClass("/base64")}>
                  Base64 Encoder/Decoder
                </Link>
              </li>
              <li>
                <Link href="/text-converter" className={getLinkClass("/text-converter")}>
                  Text Case Converter
                </Link>
              </li>
              <li>
                <Link href="/diff-checker" className={getLinkClass("/diff-checker")}>
                  Diff Checker
                </Link>
              </li>
              <li>
                <Link href="/lorem-ipsum" className={getLinkClass("/lorem-ipsum")}>
                  Lorem Ipsum Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Calculators & Design */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              Calculators & Design
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/sip-calculator" className={getLinkClass("/sip-calculator")}>
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link href="/investment-calculator" className={getLinkClass("/investment-calculator")}>
                  Investment Calculator
                </Link>
              </li>
              <li>
                <Link href="/bmi-calculator" className={getLinkClass("/bmi-calculator")}>
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/age-calculator" className={getLinkClass("/age-calculator")}>
                  Age Calculator
                </Link>
              </li>
              <li>
                <Link href="/date-calculator" className={getLinkClass("/date-calculator")}>
                  Date Calculator
                </Link>
              </li>
              <li>
                <Link href="/unit-converter" className={getLinkClass("/unit-converter")}>
                  Unit Converter
                </Link>
              </li>
              <li>
                <Link href="/color-palette" className={getLinkClass("/color-palette")}>
                  Color Palette Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className={getLinkClass("/about")}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className={getLinkClass("/use-cases")}>
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/blog" className={getLinkClass("/blog")}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className={getLinkClass("/contact")}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className={getLinkClass("/faq")}>
                  FAQ Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
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
