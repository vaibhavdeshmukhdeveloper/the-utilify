"use client";

import Link from "next/link";
import { Sparkles, Heart, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLanguageFromPathname, toolTranslations } from "@/lib/i18n/translations";
import { getUIStrings } from "@/lib/i18n/ui-strings";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const currentLang = getLanguageFromPathname(pathname);
  const t = getUIStrings(currentLang);

  const homeHref = currentLang === "en" ? "/" : `/${currentLang}`;

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "text-sm text-primary font-bold hover:underline transition-colors"
      : "text-sm text-muted-foreground hover:text-primary transition-colors";
  };

  // Helper to resolve localized tool href and name if available
  const resolveTool = (slug: string, defaultName: string) => {
    if (currentLang !== "en" && toolTranslations[currentLang]?.[slug]) {
      return {
        href: `/${currentLang}/${slug}`,
        name: toolTranslations[currentLang][slug].name,
      };
    }
    return {
      href: `/${slug}`,
      name: defaultName,
    };
  };

  return (
    <footer className="border-t bg-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Logo & Pitch */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link href={homeHref} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/10">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">
                Utilify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.pitch}
            </p>
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground block">
                {t.footer.developerApps}
              </span>
              <a
                href="https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg border border-zinc-800 dark:border-zinc-200"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.25c-.28 0-.53.15-.66.39L12.56 12l-8.22 8.36c.13.24.38.39.66.39.12 0 .23-.03.34-.09l13.11-7.53c.69-.4 1.05-1.07 1.05-1.63 0-.56-.36-1.23-1.05-1.63L5.34 3.34c-.11-.06-.22-.09-.34-.09z"/>
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 leading-none mb-0.5">{t.crossPromo.getItOn}</span>
                  <span className="text-xs font-black leading-none">{t.crossPromo.googlePlay}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: PDF & Image Tools */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              {t.footer.colPdfImage}
            </h4>
            <ul className="space-y-2.5">
              {[
                { slug: "background-remover", defaultName: "AI Background Remover" },
                { slug: "image-compressor", defaultName: "Image Compressor" },
                { slug: "compress-png", defaultName: "Compress PNG" },
                { slug: "compress-jpeg", defaultName: "Compress JPEG" },
                { slug: "make-signature-transparent", defaultName: "Transparent Signature" },
                { slug: "white-background-product-photos", defaultName: "White Background Photos" },
                { slug: "pdf-to-image", defaultName: "PDF to Image" },
                { slug: "split-pdf", defaultName: "Split PDF" },
                { slug: "merge-pdf", defaultName: "Merge PDF" },
                { slug: "markdown-to-pdf", defaultName: "Markdown to PDF" },
              ].map(({ slug, defaultName }) => {
                const item = resolveTool(slug, defaultName);
                return (
                  <li key={slug}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Developer & Text Tools */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              {t.footer.colDevText}
            </h4>
            <ul className="space-y-2.5">
              {[
                { slug: "json-formatter", defaultName: "JSON Formatter" },
                { slug: "password-generator", defaultName: "Password Generator" },
                { slug: "qr-generator", defaultName: "QR Code Generator" },
                { slug: "word-counter", defaultName: "Word Counter" },
                { slug: "text-converter", defaultName: "Case Converter" },
                { slug: "diff-checker", defaultName: "Diff Checker" },
                { slug: "base64", defaultName: "Base64 Converter" },
                { slug: "lorem-ipsum", defaultName: "Lorem Ipsum Generator" },
                { slug: "px-to-rem", defaultName: "PX to REM Converter" },
              ].map(({ slug, defaultName }) => {
                const item = resolveTool(slug, defaultName);
                return (
                  <li key={slug}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Financial & Health Calculators */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              {t.footer.colCalculators}
            </h4>
            <ul className="space-y-2.5">
              {[
                { slug: "sip-calculator", defaultName: "SIP Calculator" },
                { slug: "investment-calculator", defaultName: "Investment Calculator" },
                { slug: "fire-calculator", defaultName: "FIRE Calculator" },
                { slug: "bmi-calculator", defaultName: "BMI Calculator" },
                { slug: "age-calculator", defaultName: "Age Calculator" },
                { slug: "date-calculator", defaultName: "Date Calculator" },
                { slug: "business-days-calculator", defaultName: "Business Days Calculator" },
                { slug: "unit-converter", defaultName: "Unit Converter" },
                { slug: "color-palette", defaultName: "Color Palette Generator" },
              ].map(({ slug, defaultName }) => {
                const item = resolveTool(slug, defaultName);
                return (
                  <li key={slug}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-wider uppercase mb-4">
              {t.footer.colCompany}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className={getLinkClass("/about")}>
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className={getLinkClass("/blog")}>
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/contact" className={getLinkClass("/contact")}>
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link href="/faq" className={getLinkClass("/faq")}>
                  {t.toolLayout.faqTitle}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={getLinkClass("/privacy")}>
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={getLinkClass("/terms")}>
                  {t.footer.termsOfService}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Category Pillar Hubs & SaaS Comparisons */}
        <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-xs uppercase font-black tracking-wider text-foreground mb-3">
              {t.footer.categoryHubs}
            </h5>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <Link href="/category/pdf-tools" className="hover:text-primary transition-colors">
                PDF &amp; Document Tools Hub
              </Link>
              <span>•</span>
              <Link href="/category/image-tools" className="hover:text-primary transition-colors">
                Image &amp; Media Tools Hub
              </Link>
              <span>•</span>
              <Link href="/category/developer-tools" className="hover:text-primary transition-colors">
                Developer Utilities Hub
              </Link>
              <span>•</span>
              <Link href="/category/financial-calculators" className="hover:text-primary transition-colors">
                Financial Calculators Hub
              </Link>
            </div>
          </div>

          <div>
            <h5 className="text-xs uppercase font-black tracking-wider text-foreground mb-3">
              {t.footer.softwareAlternatives}
            </h5>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <Link href="/vs/ilovepdf" className="hover:text-primary transition-colors">
                Utilify vs iLovePDF
              </Link>
              <span>•</span>
              <Link href="/vs/smallpdf" className="hover:text-primary transition-colors">
                Utilify vs Smallpdf
              </Link>
              <span>•</span>
              <Link href="/vs/removebg" className="hover:text-primary transition-colors">
                Utilify vs Remove.bg
              </Link>
              <span>•</span>
              <Link href="/vs/tinypng" className="hover:text-primary transition-colors">
                Utilify vs TinyPNG
              </Link>
              <span>•</span>
              <Link href="/vs/ezgif" className="hover:text-primary transition-colors">
                Utilify vs Ezgif
              </Link>
              <span>•</span>
              <Link href="/vs/iloveimg" className="hover:text-primary transition-colors">
                Utilify vs iLoveIMG
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-xs uppercase font-black tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" /> {t.footer.multilingualEditions}
                </h5>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <Link href="/es" className="hover:text-primary transition-colors font-medium">
                    🇪🇸 Español (Unir PDF, Quitar Fondo, Comprimir Fotos)
                  </Link>
                  <span>•</span>
                  <Link href="/pt" className="hover:text-primary transition-colors font-medium">
                    🇧🇷 Português (Juntar PDF, Remover Fundo, Comprimir Imagens)
                  </Link>
                </div>
              </div>
              <div className="pt-2 sm:pt-0">
                <LanguageSwitcher variant="pills" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} Utilify. {t.footer.allRightsReserved} Made with <Heart className="inline-block h-3.5 w-3.5 text-red-500 fill-red-500" /> {t.footer.madeWithLove}
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {t.footer.termsOfService}
            </Link>
            <a href="/llms.txt" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              LLMs (llms.txt)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
