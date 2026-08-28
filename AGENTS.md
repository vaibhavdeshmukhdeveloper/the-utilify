<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 & Modern Web App Guidelines

This repository uses Next.js 16 (App Router), React 19, and TypeScript.
- APIs, conventions, and file structure may differ from older training data. Heed deprecation notices and read Next.js documentation when needed.
- Dynamic route params in Next.js 16 are Promises: `const { slug } = await params;` or `const { tool } = await params;`.
- Server Components are the default. Add `"use client";` only when using React state, lifecycle hooks (`useState`, `useEffect`, `useRef`), or browser APIs.
<!-- END:nextjs-agent-rules -->

# The Utilify (www.theutilify.com) - Developer & Agent Guide

Welcome to **The Utilify** — a professional-grade, privacy-first, free suite of online productivity and developer utilities.

- **Production Domain:** `https://www.theutilify.com`
- **GitHub Repository:** `https://github.com/vaibhavdeshmukhdeveloper/the-utilify`
- **Frontend CI/CD:** Auto-deployed to **Vercel** on every push to `main`.
- **Backend CI/CD:** Containerized and auto-deployed to **Google Cloud** on every push to `main`.

---

## 1. Architecture & Core Tech Stack

### Frontend (`/src`)
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4 + custom CSS variables in `src/app/globals.css`.
- **Theme:** `next-themes` (Dark/Light mode with glassmorphism navigation).
- **Icons & UI:** `lucide-react`, Radix Primitives (`components.json`), `sonner` for toast notifications.
- **Micro-Interactions:** `canvas-confetti` for celebratory feedback on copying, calculations, and downloads.
- **Math Rendering:** `katex` + `MathFormula.tsx` for LaTeX math formulas in financial and health tools.
- **Client Execution:** Formatters, encoders, calculators, batch image compression (via `jszip`), and conversions execute 100% client-side in JavaScript/WebAssembly for zero server latency.

### Backend (`/backend`)
- **Runtime:** Python 3.11 + FastAPI + Uvicorn.
- **AI Background Removal:** `rembg[cpu]` with ONNX runtime models (default `isnet-general-use`, fallback `u2netp`, `silueta`, `u2net_human_seg`, `u2net_cloth_seg`) with strict memory garbage collection.
- **PDF Manipulation:** PyMuPDF (`fitz`) for fast in-memory page splitting, merging, and high-DPI rendering.
- **Document Compiling:** Playwright Chromium Headless for HTML/Markdown-to-PDF rendering.

---

## 2. Privacy-First Architecture (Zero Data Retention)

- **Transient In-Memory Processing:** No persistent database or disk write is used for user files. Files uploaded to `/api/*` endpoints are processed entirely in RAM streams and deleted immediately upon returning binary responses.
- **Zero Account Barriers:** No user tracking, cookies for logins, or mandatory sign-ups.

---

## 3. SEO, Schema.org, OpenGraph & AdSense Standards

### Dynamic OpenGraph Cards (`src/app/api/og/route.tsx`)
- Edge runtime dynamic OG generator accepting `title`, `description`, `category`, and `badge`.
- Auto-linked in `layout.tsx`, blog articles, and tool pages for high-CTR social sharing previews.

### E-E-A-T & Authorship Policy
- **Author Attribution:** All guides and articles must be authored by `"The Utilify Editorial Team"` with links to `/about`. Never use fake or placeholder individual persona names.
- **YMYL Disclaimers & Formula Proofs:** All financial calculators (`/sip-calculator`, `/investment-calculator`) and health tools (`/bmi-calculator`) must include explicit educational disclaimers and step-by-step LaTeX formula breakdown cards.

### Programmatic SEO & Hub-and-Spoke Policy
- **No Thin Doorway Routes:** Do not generate hundreds of programmatic use-case wrapper routes with identical tool layouts.
- **Hub-and-Spoke Content:** Keep canonical tool routes indexed. Expand long-tail search intent via comprehensive (800+ word) guides in `src/lib/blog-data.ts`.

### Structured Data (Schema.org JSON-LD)
- **Tool Pages:** `ToolLayout.tsx` automatically injects `FAQPage`, `HowTo`, and `BreadcrumbList` JSON-LD for rich Google SERP snippets.
- **Tool Pages Root:** `page.tsx` defines `SoftwareApplication` JSON-LD schema with `offers: { price: "0.00" }`.
- **Blog Pages:** `src/app/blog/[slug]/page.tsx` injects `Article` and `BreadcrumbList` JSON-LD.
- **PWA Manifest:** Defined in `src/app/manifest.ts`.

### Embeddable Widgets (`/embed/[tool]`)
- Standalone embed route rendering clean, isolated interactive widgets with canonical *"Powered by The Utilify"* backlinks.
- Embed modal (`EmbedModal.tsx`) available on tool pages for one-click iframe snippet copying.

### Ad Units (`src/components/AdBanner.tsx`)
- Ad units are controlled via `process.env.NEXT_PUBLIC_ADS_ENABLED === "true"`.
- When disabled (or during review), `AdBanner` safely renders `null` to avoid empty container policy violations.

---

## 4. Code & Component Guidelines

1. **Creating a New Tool:**
   - Create route directory in `src/app/<tool-slug>/`.
   - `page.tsx`: Server Component defining `metadata` and `<JsonLd data={softwareAppSchema} />`.
   - `<ToolSlug>Client.tsx`: Client Component wrapping tool UI with `<ToolLayout title="..." description="..." howToUse={...} faqs={...} relatedTools={...} detailedContent={...}>`.
   - Add tool route to `src/app/sitemap.ts` and `src/components/ToolsGrid.tsx`.

2. **Styling & Aesthetics:**
   - Use curated HSL variables (`bg-background`, `text-foreground`, `text-primary`, `bg-card`).
   - Use rounded borders (`rounded-2xl`, `rounded-3xl`), glassmorphic backdrop filters, and subtle micro-animations.
   - Use `triggerConfetti()` from `@/lib/confetti` for celebratory feedback upon copy or completion.

3. **Verifying Code:**
   - Always run `npm run build` locally before pushing to verify TypeScript and static generation pass with 0 errors.
