<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 & Modern Web App Guidelines

This repository uses Next.js 16 (App Router), React 19, and TypeScript.
- APIs, conventions, and file structure may differ from older training data. Heed deprecation notices and read Next.js documentation when needed.
- Dynamic route params in Next.js 16 are Promises: `const { slug } = await params;` or `const { tool } = await params;`.
- Server Components are the default. Add `"use client";` only when using React state, lifecycle hooks (`useState`, `useEffect`, `useRef`), or browser APIs.
<!-- END:nextjs-agent-rules -->

# The Utilify (www.theutilify.com) - Developer & Agent Guide

Welcome to **The Utilify** — a professional-grade, privacy-first, free suite of online productivity, developer, PDF, and image utilities.

- **Production Domain:** `https://www.theutilify.com`
- **GitHub Repository:** `https://github.com/vaibhavdeshmukhdeveloper/the-utilify`
- **Frontend CI/CD:** Auto-deployed to **Vercel** on every push to `main`.
- **Backend CI/CD:** Containerized with Docker and auto-deployed to **Google Cloud Run** on every push to `main`.

---

## 1. Architecture & Core Tech Stack

### Frontend (`/src`)
- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4 + custom CSS variables in `src/app/globals.css`.
- **Theme:** `next-themes` (Dark/Light mode with glassmorphic navigation and animated theme toggles).
- **Icons & UI:** `lucide-react`, Base UI / Radix Primitives (`components.json`), `sonner` for toast notifications.
- **Micro-Interactions:** `canvas-confetti` (`src/lib/confetti.ts`) for celebratory feedback on copying, calculations, and downloads.
- **Math Rendering:** `katex` + `src/components/MathFormula.tsx` for LaTeX math formulas in financial and health tools.
- **Client Execution:** Formatters, encoders, calculators, QR generation (`qrcode`), Markdown parsing (`marked`), batch image compression (via `jszip` + Canvas API) execute 100% client-side for zero server latency.

### Backend (`/backend`)
- **Runtime:** Python 3.11 + FastAPI + Uvicorn.
- **AI Background Removal:** `rembg[cpu]` with ONNX runtime models (default `isnet-general-use`, fallback `silueta`, `u2net`, `u2net_human_seg`, `u2net_cloth_seg`) paired with an instant mathematical solid-background floodfill pre-flight detector and strict memory garbage collection.
- **PDF Manipulation:** PyMuPDF (`fitz`) for fast in-memory page splitting, merging, and 150 DPI page-to-PNG ZIP streaming.
- **Document Compiling:** Playwright Chromium Headless for styled HTML/Markdown-to-A4-PDF rendering with 1cm print margins.

---

## 2. Platform Catalog (21 Production Tools & Hubs)

### PDF Tools (4)
1. **PDF to Image (`/pdf-to-image`):** Converts multi-page PDF documents into high-DPI (150 DPI) PNGs packaged into a ZIP archive in RAM.
2. **Split PDF (`/split-pdf`):** Extracts custom page numbers or ranges (e.g. `1-3, 5, 8-10`) into an isolated PDF.
3. **Merge PDF (`/merge-pdf`):** Combines multiple uploaded PDF files sequentially into a single unified document.
4. **Markdown to PDF (`/markdown-to-pdf`):** Compiles GitHub-flavored Markdown with KaTeX equations into a pixel-perfect A4 PDF via headless Chromium.

### Image Tools (3)
5. **AI Background Remover (`/background-remover`):** Removes image backgrounds using instant solid flat background floodfill cutout or AI neural network models, complete with an interactive Before/After comparison slider (`BeforeAfterSlider.tsx`).
6. **Image Compressor (`/image-compressor`):** Client-side batch compression supporting JPEG, PNG, and WebP with individual and bulk `.zip` download support (`jszip`), plus Node.js Sharp fallback (`/api/image-compressor`).
7. **Color Palette Generator (`/color-palette`):** Extracts color schemes from uploaded images (Canvas API) and generates harmonic palettes (Monochromatic, Complementary, Triadic, Analogous) exportable to CSS/Tailwind/HEX.

### Financial & Health Calculators (5)
8. **SIP Calculator (`/sip-calculator`):** Systematic Investment Plan compound wealth growth calculator with step-up SIP, inflation adjustment, LaTeX formula breakdowns, and interactive Canvas/Chart visualizers (`CalculatorCharts.tsx`).
9. **Investment Calculator (`/investment-calculator`):** Compound interest growth calculator with configurable compounding frequencies (monthly, quarterly, annually) and LaTeX formula breakdowns.
10. **BMI Calculator (`/bmi-calculator`):** Body Mass Index and healthy weight calculator (Metric & Imperial) with WHO classification tiers and LaTeX proof breakdowns.
11. **Date Calculator (`/date-calculator`):** Date arithmetic, interval calculation, business day counts, and duration breakdown.
12. **Age Calculator (`/age-calculator`):** Exact chronological age calculator (years, months, days, minutes, seconds), next birthday countdown, and astrological zodiac sign.

### Developer Utilities & Text Tools (9)
13. **JSON Formatter & Validator (`/json-formatter`):** Real-time JSON validation, tree/raw view toggles, key sorting, indentation formatting (2/4 spaces/tabs), and minification.
14. **Password Generator (`/password-generator`):** Cryptographically secure (`crypto.getRandomValues`) customizable passwords and passphrases with entropy score and strength analyzer.
15. **QR Code Generator (`/qr-generator`):** Customizable QR generator for URLs, Wi-Fi credentials, vCards, Email, and plain text with error correction levels (L/M/Q/H), color pickers, and PNG/SVG downloads.
16. **Word Counter & Text Analyzer (`/word-counter`):** Real-time character, word, sentence, paragraph, reading time, speaking time, and top-keyword frequency analyzer.
17. **Case & Text Converter (`/text-converter`):** Multi-case string conversion (camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, lowercase, Title Case, Sentence case) and whitespace normalization.
18. **Base64 Encoder / Decoder (`/base64`):** Text and binary file Base64 encoding/decoding with Data URI previews and UTF-8 compliance.
19. **Diff & Text Comparison Checker (`/diff-checker`):** Visual side-by-side and unified text comparison with character/word/line level highlighting.
20. **Lorem Ipsum Generator (`/lorem-ipsum`):** Dummy placeholder text generator with custom paragraph, word, byte, and list counts with optional HTML formatting.
21. **Unit Converter (`/unit-converter`):** Multi-category unit converter across 9 measurement dimensions (Length, Weight, Temperature, Area, Volume, Speed, Time, Digital Storage, Energy).

---

## 3. SEO, Schema.org, Pillar Pages & Monetization Standards

### Category Hub Pillar Pages (`/category/*`)
- `/category/pdf-tools`: Hub page featuring PDF to Image, Split PDF, Merge PDF, and Markdown to PDF.
- `/category/image-tools`: Hub page featuring AI Background Remover, Image Compressor, Color Palette Generator.
- `/category/developer-tools`: Hub page featuring JSON Formatter, Base64, Diff Checker, Password Generator, QR Generator, Text Converter, Lorem Ipsum, Word Counter.
- `/category/financial-calculators`: Hub page featuring SIP Calculator, Investment Calculator, BMI Calculator, Date Calculator, Age Calculator, Unit Converter.
- Built using `CategoryHubLayout.tsx` for high topical authority and internal linking.

### SaaS Alternative Comparison Landing Pages (`/vs/*`)
- `/vs/ilovepdf`: "The Utilify vs iLovePDF" highlighting privacy, zero file retention, and unlimited free batch operations.
- `/vs/removebg`: "The Utilify vs Remove.bg" highlighting 100% free high-resolution downloads without subscription credits.
- `/vs/tinypng`: "The Utilify vs TinyPNG" highlighting local client-side compression and WebP support.
- Built using `ComparisonLayout.tsx`.

### Dynamic OpenGraph & Meta Engine (`src/app/api/og/route.tsx`)
- Edge runtime dynamic 1200x630 OG image generator accepting `title`, `description`, `category`, and `badge`.
- Auto-linked across tool pages, blog articles, category hubs, and root layout.

### Dynamic RSS 2.0 Feed (`src/app/feed.xml/route.ts`)
- Automated XML feed generated from `blogPosts` in `src/lib/blog-data.ts`.

### Structured Data (Schema.org JSON-LD)
- **Tool Pages:** `src/lib/seo-helpers.ts` provides `getSoftwareAppSchema()` with `SoftwareApplication`, `AggregateRating`, and `offers: { price: "0.00" }`.
- **Tool Layout:** `src/components/ToolLayout.tsx` automatically injects `FAQPage`, `HowTo`, and `BreadcrumbList` JSON-LD schemas.
- **Blog Pages:** `src/app/blog/[slug]/page.tsx` injects `Article` and `BreadcrumbList` JSON-LD.
- **Sitemap & Robots:** `src/app/sitemap.ts` and `src/app/robots.ts` index all tools, categories, vs pages, and blog posts while allowing AI crawlers (`Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot`, `CCBot`).

### E-E-A-T & Authorship Policy
- **Author Attribution:** All guides and articles must be authored by `"The Utilify Editorial Team"` with canonical links to `/about`.
- **YMYL Disclaimers & Formula Proofs:** All financial calculators (`/sip-calculator`, `/investment-calculator`) and health tools (`/bmi-calculator`) must include educational disclaimers and step-by-step LaTeX formula breakdown cards via `MathFormula.tsx`.

### Embeddable Widgets (`/embed/[tool]`)
- Standalone embed route rendering clean, responsive interactive widgets with canonical *"Powered by The Utilify"* backlinks.
- Interactive modal (`EmbedModal.tsx`) available on tool pages for one-click iframe snippet copying.

### Ad Units (`src/components/AdBanner.tsx`)
- Controlled via `process.env.NEXT_PUBLIC_ADS_ENABLED === "true"`.
- Safely renders `null` when disabled to avoid empty container policy violations during AdSense reviews.

---

## 4. Interactive Components & Platform Features

- **Global Command Palette (`CommandPalette.tsx`):** `Ctrl+K` / `Cmd+K` instant search modal across all tools, categories, and blog posts.
- **Tool Workflow Chaining (`ToolWorkflowChaining.tsx`):** Contextual next-action recommendations displayed after a tool output is produced (e.g. compress image -> remove background).
- **Interactive Playground (`HeroPlayground.tsx`):** Live interactive micro-demo tabs on the homepage for instant user engagement.
- **Before/After Comparison Slider (`BeforeAfterSlider.tsx`):** Interactive split-view comparison slider for image processing tools.
- **Financial Visualizers (`CalculatorCharts.tsx`):** Interactive canvas/SVG visualizers for wealth projections.

---

## 5. Privacy-First Architecture (Zero Data Retention)

- **Transient In-Memory Processing:** No database or persistent disk writes. Files uploaded to `/image/*` or `/pdf/*` are processed purely in RAM streams (`io.BytesIO()`) and released immediately upon streaming the HTTP response.
- **Zero Account Barriers:** No user tracking, cookies for logins, or mandatory sign-ups.

---

## 6. Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend microservices | `http://localhost:8000` or Cloud Run URL |
| `NEXT_PUBLIC_ADS_ENABLED` | Feature flag to render Google AdSense ad banners | `"true"` or `"false"` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification meta token | String token |
| `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` | Yandex Webmaster verification meta token | `31ab4f299bc6b423` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools verification meta token | String token |

---

## 7. Code & Component Guidelines

1. **Creating a New Tool:**
   - Create route directory in `src/app/<tool-slug>/`.
   - `page.tsx`: Server Component defining `metadata` and `<JsonLd data={getSoftwareAppSchema({ name, description, slug })} />`.
   - `<ToolSlug>Client.tsx`: Client Component wrapping tool UI with `<ToolLayout title="..." description="..." howToUse={...} faqs={...} relatedTools={...} detailedContent={...}>`.
   - Add tool route to `src/app/sitemap.ts`, `src/components/ToolsGrid.tsx`, `src/components/Footer.tsx`, and `src/app/embed/[tool]/page.tsx` (if embeddable).

2. **Styling & Aesthetics:**
   - Use curated HSL variables (`bg-background`, `text-foreground`, `text-primary`, `bg-card`).
   - Use rounded borders (`rounded-2xl`, `rounded-3xl`), glassmorphic backdrop filters, and subtle micro-animations.
   - Use `triggerConfetti()` from `@/lib/confetti` for celebratory feedback upon copy or completion.

3. **Verifying Code:**
   - Always run `npm run build` locally before pushing to verify TypeScript and static generation pass with 0 errors.
