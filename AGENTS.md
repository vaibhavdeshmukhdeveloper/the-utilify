<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 & Modern Web App Guidelines

This repository uses Next.js 16 (App Router), React 19, and TypeScript.
- APIs, conventions, and file structure may differ from older training data. Heed deprecation notices and read Next.js documentation when needed.
- Dynamic route params in Next.js 16 are Promises: `const { slug } = await params;` or `const { tool, lang } = await params;`.
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
- **Math Rendering:** `katex` + `src/components/MathFormula.tsx` (with automatic double-backslash normalization) for LaTeX math formulas in interactive financial/health tools, plus server-side KaTeX rendering in blog articles (`src/app/blog/[slug]/page.tsx`) via custom `marked` extensions with `sanitizeMath()` control character filtering.
- **Client Execution:** Formatters, encoders, calculators, QR generation (`qrcode`), Markdown parsing (`marked`), PX to REM converters, and batch image compression (via `jszip` + Canvas API) execute 100% client-side for zero server latency.

### Backend (`/backend`)
- **Runtime:** Python 3.11 + FastAPI + Uvicorn.
- **AI Background Removal:** `rembg[cpu]` with ONNX runtime models (default `isnet-general-use`, options `silueta`, `u2net`, `u2net_human_seg`, `u2net_cloth_seg`) with strict single-session memory management and explicit garbage collection.
- **PDF Manipulation:** PyMuPDF (`fitz`) for fast in-memory page splitting, merging, and 150 DPI page-to-PNG ZIP streaming.
- **Document Compiling:** Playwright Chromium Headless for styled HTML/Markdown-to-A4-PDF rendering with 1cm print margins.
- **Persistent Ratings Database:** Google Cloud Firestore (Native Mode, Always Free Tier) via `google-cloud-firestore` with serverless atomic increments (`firestore.Increment`) and local JSON fallback for offline development.
- **RFC 5987 / RFC 6266 Unicode Downloads:** `format_content_disposition(filename)` providing percent-encoded UTF-8 directives (`filename*=UTF-8''...`) with sanitized ASCII fallbacks to prevent `latin-1` byte header crashes on international filenames.

---

## 2. Platform Catalog (30 Production Tools & Programmatic Landing Pages)

### PDF Tools (5)
1. **PDF to Image (`/pdf-to-image`):** Converts multi-page PDF documents into high-DPI (150 DPI) PNGs packaged into a ZIP archive in RAM.
2. **PDF to JPG (`/pdf-to-jpg`):** Dedicated high-volume programmatic landing page converting multi-page PDFs to JPG images for rapid sharing.
3. **Split PDF (`/split-pdf`):** Extracts custom page numbers or ranges (e.g. `1-3, 5, 8-10`) into an isolated PDF.
4. **Merge PDF (`/merge-pdf`):** Combines multiple uploaded PDF files sequentially into a single unified document.
5. **Markdown to PDF (`/markdown-to-pdf`):** Compiles GitHub-flavored Markdown with KaTeX equations into a pixel-perfect A4 PDF via headless Chromium.

### Image Tools & Programmatic Landing Pages (8)
6. **AI Background Remover (`/background-remover`):** Removes image backgrounds with sub-pixel precision using deep neural network models (`isnet-general-use`, `u2net`, etc.), complete with an interactive Before/After comparison slider (`BeforeAfterSlider.tsx`) and manual touchup eraser.
7. **Image Compressor (`/image-compressor`):** Client-side batch compression supporting JPEG, PNG, and WebP with individual and bulk `.zip` download support (`jszip`), plus Node.js Sharp fallback (`/api/image-compressor`).
8. **Color Palette Generator (`/color-palette`):** Extracts color schemes from uploaded images (Canvas API) and generates harmonic palettes (Monochromatic, Complementary, Triadic, Analogous) exportable to CSS/Tailwind/HEX.
9. **Compress PNG (`/compress-png`):** Dedicated programmatic landing page targeting PNG compression with 32-bit RGBA alpha transparency preservation.
10. **Compress JPEG (`/compress-jpeg`):** Dedicated programmatic landing page targeting lossy JPEG compression and Core Web Vitals (LCP) reduction.
11. **Compress WebP (`/compress-webp`):** Dedicated programmatic landing page targeting modern next-gen WebP compression for maximum bandwidth savings.
12. **Make Signature Transparent (`/make-signature-transparent`):** Isolates handwritten signature ink strokes from paper photos into transparent PNGs for PDF signing.
13. **White Background Product Photos (`/white-background-product-photos`):** Replaces messy backdrops with pure `#FFFFFF` Amazon, Shopify, and eBay compliant studio backgrounds.

### Financial & Health Calculators (7)
14. **SIP Calculator (`/sip-calculator`):** Systematic Investment Plan compound wealth growth calculator with step-up SIP, inflation adjustment, LaTeX formula breakdowns, and interactive Canvas/Chart visualizers (`CalculatorCharts.tsx`).
15. **Investment Calculator (`/investment-calculator`):** Compound interest growth calculator with monthly contributions and daily, monthly, quarterly, or annual compounding frequencies.
16. **FIRE Calculator (`/fire-calculator`):** Financial Independence Retire Early calculator computing 4% rule targets, Lean FIRE (75%), Standard FIRE (100%), and Fat FIRE (125%) milestones with Fisher inflation adjustment and 100+ year horizon handling.
17. **BMI Calculator (`/bmi-calculator`):** Body Mass Index and healthy weight calculator (Metric & Imperial) with WHO classification tiers and LaTeX proof breakdowns.
18. **Date Calculator (`/date-calculator`):** Date arithmetic, interval duration, business day counts, and timezone-safe duration breakdown.
19. **Business Days Calculator (`/business-days-calculator`):** Dedicated programmatic landing page calculating working days, weekends, and project timelines.
20. **Age Calculator (`/age-calculator`):** Exact chronological age calculator (years, months, days, minutes, seconds), next birthday countdown, and timezone-safe leap-year handling.

### Developer Utilities & Text Tools (10)
21. **JSON Formatter & Validator (`/json-formatter`):** Real-time JSON validation, tree/raw view toggles, key sorting, indentation formatting (2/4 spaces/tabs), and minification.
22. **Password Generator (`/password-generator`):** Cryptographically secure (`crypto.getRandomValues`) customizable passwords and passphrases with entropy score and NIST-aligned strength analyzer.
23. **QR Code Generator (`/qr-generator`):** Customizable QR generator for URLs, Wi-Fi credentials, vCards, Email, and plain text with error correction levels (L/M/Q/H), color pickers, and PNG/SVG downloads.
24. **Word Counter & Text Analyzer (`/word-counter`):** Real-time character, word, sentence, paragraph, reading time, speaking time, and top-keyword frequency analyzer.
25. **Case & Text Converter (`/text-converter`):** Multi-case string conversion (camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, lowercase, Title Case, Sentence case) and whitespace normalization.
26. **Base64 Encoder / Decoder (`/base64`):** Text and binary file Base64 encoding/decoding with Data URI previews and UTF-8 compliance.
27. **Diff & Text Comparison Checker (`/diff-checker`):** Visual side-by-side and unified text comparison with character/word/line level highlighting.
28. **Lorem Ipsum Generator (`/lorem-ipsum`):** Dummy placeholder text generator with custom paragraph, word, byte, and list counts with optional HTML formatting.
29. **Unit Converter (`/unit-converter`):** Multi-category unit converter across 5 measurement dimensions (Length, Weight, Temperature, Area, Volume) with high-precision small quantity formatting.
30. **PX to REM Converter (`/px-to-rem`):** Bidirectional PX ↔ REM/EM/PT converter, CSS `clamp()` fluid typography generator with division-by-zero guards, and Tailwind v4 spacing token cheat sheet.

---

## 3. Multilingual Architecture (i18n)

### Category Hubs & Localized Routes
- **Spanish Hub (`/es`):** Curated Spanish landing page highlighting core PDF, image, and financial tools.
- **Portuguese Hub (`/pt`):** Curated Portuguese landing page for Brazilian & Portuguese audiences.
- **Dynamic Localized Tool Routes (`/[lang]/[tool]`):** Powered by `src/app/[lang]/[tool]/page.tsx` with static site generation (`generateStaticParams` pre-rendering 38 localized routes).
- **Dictionary Source of Truth (`src/lib/i18n/translations.ts`):** Centralized translation repository with metadata, titles, descriptions, feature lists, step-by-step guides, and localized FAQs for Spanish and Portuguese.
- **Bidirectional `hreflang` Tags:** Automatically injected into `<head>` alternates (`en`, `es`, `pt`, and `x-default`) on both English and localized pages to prevent duplicate content penalties.

---

## 4. Generative Engine Optimization (GEO) & AI Crawlers

### Machine-Readable LLM Manifests
- **`/llms.txt` (`public/llms.txt`):** Concise markdown index designed for LLMs, Perplexity, and AI search engines detailing the site's privacy-first architecture, tools, and category hubs.
- **`/llms-full.txt` (`public/llms-full.txt`):** Comprehensive technical manifest documenting full URL endpoints, math formulas, schemas, and usage specifications.
- **Discovery Link:** `<link rel="describedby" href="/llms.txt" type="text/plain">` in root layout (`src/app/layout.tsx`).

### AI Crawler Configuration (`src/app/robots.ts`)
Explicitly welcomes modern AI indexers alongside standard search bots:
- `Googlebot`, `Bingbot`, `Yandex`
- `OAI-SearchBot`, `GPTBot` (OpenAI / ChatGPT Search)
- `ClaudeBot` (Anthropic)
- `PerplexityBot` (Perplexity AI)
- `Meta-ExternalAgent` (Meta AI)
- `cohere-ai` (Cohere)
- `Applebot` (Apple Intelligence)

---

## 5. SEO, Schema.org, Pillar Pages & Indexing Automation

### Category Hub Pillar Pages (`/category/*`)
- `/category/pdf-tools`: Hub page featuring PDF to Image, PDF to JPG, Split PDF, Merge PDF, and Markdown to PDF.
- `/category/image-tools`: Hub page featuring AI Background Remover, Image Compressor, Color Palette Generator, and format optimizers.
- `/category/developer-tools`: Hub page featuring JSON Formatter, Base64, Diff Checker, Password Generator, QR Generator, Text Converter, Lorem Ipsum, Word Counter, PX to REM.
- `/category/financial-calculators`: Hub page featuring SIP Calculator, Investment Calculator, FIRE Calculator, BMI Calculator, Date Calculator, Business Days Calculator, Age Calculator, Unit Converter.
- Built using `CategoryHubLayout.tsx` for high topical authority and internal linking.

### SaaS Alternative Comparison Landing Pages (`/vs/*`)
- `/vs/ilovepdf`: "The Utilify vs iLovePDF" highlighting privacy, zero file retention, and unlimited free batch operations.
- `/vs/removebg`: "The Utilify vs Remove.bg" highlighting 100% free high-resolution downloads without subscription credits.
- `/vs/tinypng`: "The Utilify vs TinyPNG" highlighting local client-side compression and WebP support.
- `/vs/smallpdf`: "The Utilify vs Smallpdf" highlighting zero 2-task daily limits and no subscription paywalls.
- `/vs/ezgif`: "The Utilify vs Ezgif" highlighting ad-free, modern WebAssembly image tools.
- `/vs/iloveimg`: "The Utilify vs iLoveIMG" highlighting zero cloud storage and instant batch ZIP exports.
- Built using `ComparisonLayout.tsx`.

### Automated Search Engine & IndexNow Submission
- **Lifecycle Hook (`package.json`):** `"postbuild": "node scripts/ping-search-engines.mjs"` automatically triggers upon successful static builds on Vercel and Google Cloud Run.
- **IndexNow Protocol:** Automatically submits all **206 platform URLs** to `api.indexnow.org` and `yandex.com/indexnow` with domain verification key `8e4f1a293c7d4b6e8a0f2c4e6a8d0b2f`.
- **On-Demand Endpoints:** `npm run ping` CLI command and `GET /api/indexnow?action=submit-all`.

### Dynamic OpenGraph & Meta Engine (`src/app/api/og/route.tsx`)
- Edge runtime dynamic 1200x630 OG image generator accepting `title`, `description`, `category`, and `badge`.
- Auto-linked across tool pages, blog articles, category hubs, and root layout.

### Dynamic RSS 2.0 Feed (`src/app/feed.xml/route.ts`)
- Automated XML feed generated from 117 in-depth articles in `src/lib/blog-data.ts`.

### Structured Data (Schema.org JSON-LD)
- **Tool Pages:** `src/lib/seo-helpers.ts` provides `getSoftwareAppSchema()` with `SoftwareApplication`, `AggregateRating`, and `offers: { price: "0.00" }`.
- **Tool Layout:** `src/components/ToolLayout.tsx` automatically injects `FAQPage`, `HowTo`, and `BreadcrumbList` JSON-LD schemas.
- **Blog Pages:** `src/app/blog/[slug]/page.tsx` injects `Article` and `BreadcrumbList` JSON-LD.
- **Comparison Pages:** `src/components/ComparisonLayout.tsx` injects `FAQPage` and `BreadcrumbList` JSON-LD.
- **Sitemap & Robots:** `src/app/sitemap.ts` and `src/app/robots.ts` index all 101 static routes, 38 localized routes, and 117 blog posts.

---

## 6. Mathematical, Timezone & Core Logic Standards

1. **Investment & Financial Compounding:**
   - Always structure investment contributions as a monthly loop ($12 \times PMT$/year) rather than period-dependent loops.
   - For daily compounding, compound the balance daily ($365/yr$) while keeping contributions strictly monthly ($12/yr$).
   - Ensure strict monotonic ordering: $Daily > Monthly > Quarterly > Annually$.

2. **Timezone-Safe Calendar Math:**
   - Never use `new Date("YYYY-MM-DD")` for date calculation, as ISO date strings parse to UTC midnight and shift to the previous day in timezones with negative UTC offsets (US/Americas).
   - Always parse using local midnight:
     ```ts
     function parseLocalDate(dateStr: string): Date | null {
       const [y, m, d] = dateStr.split("-").map(Number);
       return new Date(y, m - 1, d);
     }
     ```
   - For calendar day counts, use UTC timestamps (`Date.UTC(y, m, d)`) to eliminate 23-hour or 25-hour Daylight Saving Time (DST) clock-shift discrepancies.

3. **Small-Quantity Precision:**
   - When converting measurements (e.g. milligrams to metric tons), avoid blanket `toFixed(6)` which rounds small values to `"0"`. Use `toPrecision(6)` fallback for numbers $< 10^{-6}$ or $\ge 10^{10}$.

4. **Division-by-Zero Safety:**
   - In fluid typography `clamp()`, guard against `baseSize <= 0` and equal viewport boundaries (`clampMaxVw <= clampMinVw`).
   - In retirement calculations, clamp inflation denominators (`Math.max(0.01, 1 + inflation/100)`) and cap time horizons $\ge 100$ years as `"100+ Yrs"`.

5. **Template Literal LaTeX Escaping Standards & Control Character Safety:**
   - In JavaScript/TypeScript template literals (e.g. `src/lib/blog-data.ts`), **ALWAYS** escape LaTeX command backslashes with double backslashes: `\\frac`, `\\text`, `\\times`, `\\log`, `\\approx`, `\\sqrt`, `\\le`, `\\ge`, `\\pm`, `\\cdot`, etc.
   - **Critical JS Parser Pitfall:** In JS template literals, `\f` evaluates to Form Feed (`\x0c`) and `\t` evaluates to Tab (`\x09`). If written with single backslashes (`\frac`, `\text`), the runtime string receives `\x0crac` and `\x09ext`, corrupting KaTeX parsing.
   - In `src/app/blog/[slug]/page.tsx`, `sanitizeMath()` defensively filters non-printable ASCII control characters (`\x00`–`\x1F` except `\n`, `\r`) before passing strings to `katex.renderToString()`.
   - In client components, `<MathFormula formula="..." />` defensively normalizes double backslashes via `.replace(/\\\\([a-zA-Z]+)/g, "\\$1")` so formulas render correctly whether passed with single or double backslashes.
   - **Markdown Inline Code in Template Literals:** When writing backtick snippets inside template literals, format carefully (e.g. `(\`\` \`\`\` \`\`)`) to prevent premature termination of template literals.

---

## 7. Interactive Components & Platform Features

- **Global Command Palette (`CommandPalette.tsx`):** `Ctrl+K` / `Cmd+K` instant search modal across all tools, categories, and blog posts.
- **Tool Workflow Chaining (`ToolWorkflowChaining.tsx`):** Contextual next-action recommendations displayed after a tool output is produced.
- **Interactive Playground (`HeroPlayground.tsx`):** Live interactive micro-demo tabs on the homepage for instant user engagement.
- **Before/After Comparison Slider (`BeforeAfterSlider.tsx`):** Interactive split-view comparison slider for image processing tools.
- **Financial Visualizers (`CalculatorCharts.tsx`):** Interactive canvas/SVG visualizers for wealth projections.

---

## 8. Privacy-First Architecture & Data Integrity

- **Transient In-Memory Processing (Zero Retention):** Neither the frontend nor the backend databases store user-uploaded images or PDFs. Files sent to Python microservices are processed purely in RAM streams (`io.BytesIO()`) and released immediately upon streaming binary responses.
- **Zero Account Barriers:** No user tracking, cookies for logins, or mandatory sign-ups.
- **Authentic Community Feedback Policy:** Tool ratings represent 100% genuine user votes. Zero artificial or seeded baseline reviews are permitted. Ratings are stored permanently in Google Cloud Firestore (`ratings` collection), surviving container restarts and redeployments.

---

## 9. Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend microservices | `http://localhost:8000` or Cloud Run URL |
| `NEXT_PUBLIC_ADS_ENABLED` | Feature flag to render Google AdSense ad banners | `"true"` or `"false"` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification meta token | String token |
| `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` | Yandex Webmaster verification meta token | `31ab4f299bc6b423` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools verification meta token | String token |

---

## 10. Code & Component Guidelines

1. **Creating a New Tool:**
   - Create route directory in `src/app/<tool-slug>/`.
   - `page.tsx`: Server Component defining `metadata` and `<JsonLd data={getSoftwareAppSchema({ name, description, slug })} />`.
   - `<ToolSlug>Client.tsx`: Client Component wrapping tool UI with `<ToolLayout title="..." description="..." howToUse={...} faqs={...} relatedTools={...} detailedContent={...}>`.
   - Add tool route to `src/app/sitemap.ts`, `src/components/ToolsGrid.tsx`, `src/components/Footer.tsx`, and `src/app/embed/[tool]/page.tsx` (if embeddable).
   - If localizing, add translation dictionary in `src/lib/i18n/translations.ts` and add dynamic component in `src/app/[lang]/[tool]/page.tsx`.

2. **Slider Components Typing Pattern:**
   - When using Base UI Slider (`src/components/ui/slider.tsx`), `onValueChange` passes `number | readonly number[]`. Always handle as `(val) => setField(Array.isArray(val) ? val[0] : val)`.

3. **Cloud Run Container Port Binding:**
   - Always run uvicorn with dynamic port binding in `Dockerfile`: `CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]` to prevent Cloud Run health check timeout crashes.

4. **HTTP Header Filename Encoding (RFC 5987 / RFC 6266):**
   - Whenever backend endpoints return user-downloadable files, sanitize ASCII filenames and provide `filename*=UTF-8''...` to avoid Starlette `latin-1` codec crashes.
   - Frontend `@/lib/api.ts` parses `filename*` headers to preserve genuine Unicode characters for client downloads.

5. **Verifying Code:**
   - Always run `npm run build` locally before pushing to verify TypeScript and static generation pass with 0 errors.

6. **Blog Guide Quality & Integrity (`src/lib/blog-data.ts`):**
   - Ensure zero boilerplate leakage: never paste foreign UI widgets (e.g., image-compression HTML or file dropzones) into financial or developer articles.
   - Ensure all mathematical equations use double backslashes (`\\frac{...}{...}`) in template strings.
   - Always run `npx tsc --noEmit` and `npm run build` locally before pushing.
