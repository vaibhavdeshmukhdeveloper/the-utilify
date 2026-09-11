---
name: theutilify-dev
description: Developer runbooks and architectural guide for The Utilify web application (Next.js 16 App Router, FastAPI backend, Schema.org SEO, AdSense compliance, OpenGraph generator, category pillar hubs, competitor comparisons, programmatic long-tail pages, IndexNow search engine indexing, multilingual i18n, GEO llms.txt, embeddable widgets, and deployment).
---

# The Utilify Developer & Engineering Runbooks

This skill provides step-by-step procedures for building, maintaining, and scaling tools, programmatic landing pages, category pillar hubs, competitor comparison pages, multilingual routes, blog articles, and backend microservices on **The Utilify** (`https://www.theutilify.com`).

---

## Architecture Quick Reference

- **Frontend:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4.
- **Client Execution:** Client-side formatters, encoders, calculators, QR generation (`qrcode`), KaTeX formula cards (`katex` + `MathFormula.tsx` with automatic double-backslash normalization), server-side KaTeX rendering in blog guides (`src/app/blog/[slug]/page.tsx`) via custom `marked` extensions with `sanitizeMath()` control character filtering, PX to REM fluid generators, and batch image compression (`jszip` + Canvas API).
- **Dynamic OG Engine:** `/api/og` route built on `@vercel/og` Edge runtime for rich 1200x630 social sharing cards.
- **Dynamic RSS Feed:** `/feed.xml` route delivering automated RSS 2.0 channel updates for all 117+ blog publications.
- **Embed Engine:** `/embed/[tool]` route rendering responsive iframe widgets with canonical backlinks and modal snippet generator (`EmbedModal.tsx`).
- **Multilingual (i18n):** Spanish (`/es`) and Portuguese (`/pt`) category hubs and dynamic localized routes `src/app/[lang]/[tool]/page.tsx` with 38 pre-rendered static routes and bidirectional `hreflang` tags.
- **Generative Engine Optimization (GEO):** `public/llms.txt` and `public/llms-full.txt` machine-readable manifests, `<link rel="describedby">`, and AI crawler permissions in `src/app/robots.ts` (`OAI-SearchBot`, `Meta-ExternalAgent`, `cohere-ai`, `ClaudeBot`, `GPTBot`, `PerplexityBot`, etc.).
- **Search Engine Automation:** `postbuild` script in `package.json` triggers `scripts/ping-search-engines.mjs` to dispatch 206 URLs to IndexNow (`api.indexnow.org`, `yandex.com/indexnow`) and XML sitemap pings upon build/deploy.
- **Interactive UI Stack:** Global Command Palette (`Ctrl+K` / `Cmd+K`), Tool Workflow Chaining (`ToolWorkflowChaining.tsx`), Before/After Comparison Slider (`BeforeAfterSlider.tsx`), and Homepage Micro-Playground (`HeroPlayground.tsx`).
- **Backend:** FastAPI (Python 3.11) with PyMuPDF (`fitz`), Playwright Chromium Headless, and ONNX runtime (`rembg`).
- **Persistent Ratings Database:** Google Cloud Firestore (Native Mode, Always Free Tier) with atomic increments (`firestore.Increment`) for permanent authentic community ratings across serverless container restarts.
- **RFC 5987 / RFC 6266 Unicode Downloads:** `format_content_disposition()` delivering percent-encoded UTF-8 filename headers to prevent `latin-1` Starlette crashes.
- **Deployments:** Auto-deployed to Vercel (frontend) and Google Cloud Run (backend) upon push to `main`.

---

## Platform Catalog (30 Tools & Programmatic Pages Across 4 Categories)

| Category | Tools & Slugs |
| :--- | :--- |
| **PDF Operations (5)** | `/pdf-to-image`, `/pdf-to-jpg`, `/split-pdf`, `/merge-pdf`, `/markdown-to-pdf` |
| **Image Processing (8)** | `/background-remover`, `/image-compressor`, `/color-palette`, `/compress-png`, `/compress-jpeg`, `/compress-webp`, `/make-signature-transparent`, `/white-background-product-photos` |
| **Calculators & Math (7)** | `/sip-calculator`, `/investment-calculator`, `/fire-calculator`, `/bmi-calculator`, `/date-calculator`, `/business-days-calculator`, `/age-calculator` |
| **Developer & Text (10)** | `/json-formatter`, `/password-generator`, `/qr-generator`, `/word-counter`, `/text-converter`, `/base64`, `/diff-checker`, `/lorem-ipsum`, `/unit-converter`, `/px-to-rem` |

---

## Competitor Comparisons (6 Pages)

| Route | Competitor Target | Key Search Intent |
| :--- | :--- | :--- |
| `/vs/ilovepdf` | iLovePDF | Free privacy-first alternative without daily file limits |
| `/vs/removebg` | Remove.bg | Free high-resolution cutout downloads without credit subscriptions |
| `/vs/tinypng` | TinyPNG | Local client-side browser compression with zero cloud uploads |
| `/vs/smallpdf` | Smallpdf | Unlimited PDF operations without 2-task daily lockouts or $108/yr paywalls |
| `/vs/ezgif` | Ezgif | Modern, ad-free WebAssembly image optimization with dark mode |
| `/vs/iloveimg` | iLoveIMG | 100% private in-browser batch processing with 1-click ZIP export |

---

## Runbook 1: Adding a New Utility Tool

Follow this procedure when creating a new primary tool:

### 1. Create the Route Directory
Create `src/app/<tool-slug>/`:

- **`page.tsx`** (Server Component):
  ```tsx
  import { Metadata } from "next";
  import ToolClient from "./ToolClient";
  import { JsonLd } from "@/components/JsonLd";
  import { getSoftwareAppSchema } from "@/lib/seo-helpers";

  const ogUrl = "https://www.theutilify.com/api/og?title=Tool%20Name&category=Category&badge=100%25%20Free";

  export const metadata: Metadata = {
    title: "Tool Name - Free Online Utility | Utilify",
    description: "Perform tool action fast, free, and securely in your browser.",
    alternates: { canonical: "/<tool-slug>" },
    openGraph: {
      title: "Tool Name - Free Online Utility | Utilify",
      description: "Perform tool action fast, free, and securely in your browser.",
      url: "https://www.theutilify.com/<tool-slug>",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: "Tool Name" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tool Name | Utilify",
      description: "Perform tool action fast, free, and securely in your browser.",
      images: [ogUrl],
    },
  };

  export default function Page() {
    const schema = getSoftwareAppSchema({
      name: "Tool Name",
      description: "Perform tool action fast, free, and securely in your browser.",
      slug: "<tool-slug>",
      applicationCategory: "UtilityApplication",
    });

    return (
      <>
        <JsonLd data={schema} />
        <ToolClient />
      </>
    );
  }
  ```

- **`<ToolSlug>Client.tsx`** (Client Component):
  Wrap with `ToolLayout`:
  ```tsx
  "use client";

  import { useState } from "react";
  import { ToolLayout } from "@/components/ToolLayout";
  import { triggerConfetti } from "@/lib/confetti";
  import { ToolWorkflowChaining } from "@/components/ToolWorkflowChaining";

  export default function ToolClient() {
    return (
      <ToolLayout
        title="Tool Name"
        description="Short, compelling description of what the tool accomplishes."
        howToUse={[
          { step: "Step 1", description: "First action user takes." },
          { step: "Step 2", description: "Second action user takes." },
          { step: "Step 3", description: "Download or copy the output." }
        ]}
        faqs={[
          { question: "Is this tool free?", answer: "Yes, 100% free with no limits." },
          { question: "Are my files stored?", answer: "Never. Files are processed in RAM and wiped immediately." }
        ]}
        relatedTools={[
          { name: "Related Tool 1", href: "/related-tool-1" },
          { name: "Related Tool 2", href: "/related-tool-2" }
        ]}
        detailedContent={(
          <article className="space-y-4">
            <h3>How It Works</h3>
            <p>Detailed technical guide and mathematical/algorithmic explanation.</p>
          </article>
        )}
      >
        {/* Interactive Tool Widget UI */}
      </ToolLayout>
    );
  }
  ```

### 2. Register in Navigation, Grids, and Sitemap
1. **Sitemap:** Add `"/<tool-slug>"` to `tools` array in `src/app/sitemap.ts`.
2. **Home Grid:** Add tool entry to `src/components/ToolsGrid.tsx`.
3. **Footer:** Add link in appropriate category column in `src/components/Footer.tsx`.
4. **Search Ping Engine:** Add to `src/lib/indexnow.ts` and `scripts/ping-search-engines.mjs`.
5. **Command Palette:** If search keyword additions are needed, verify matching in `src/components/CommandPalette.tsx`.
6. **Embed Engine:** If client-side embeddable, add slug to `EMBEDDABLE_TOOLS` array in `src/app/embed/[tool]/page.tsx`.

---

## Runbook 2: Creating a Programmatic Long-Tail Landing Page

When targeting high-volume specific search intent (e.g. `/pdf-to-jpg`, `/compress-webp`, `/business-days-calculator`):

1. **Re-use existing engine:** Instead of duplicating complex UI code, pass custom props to existing clients:
   - Example: `src/app/pdf-to-jpg/PdfToJpgClient.tsx` wraps `PdfToImageClient` with `defaultFormat="jpg"`, `customTitle="PDF to JPG Converter"`.
   - Example: `src/app/business-days-calculator/BusinessDaysClient.tsx` wraps `DateCalculatorClient` with `initialTab="diff"`.
2. **Dedicated Metadata & Schema:**
   - Define custom page title, meta description, and `SoftwareApplication` JSON-LD schema focused on the specific keyword.
3. **Internal Linking:**
   - Ensure the parent tool page links to this programmatic page, and this programmatic page links back to the parent and category hub.

---

## Runbook 3: Adding / Extending Multilingual Localization (i18n)

When localizing tools for global audiences (Spanish & Portuguese):

1. **Update Translation Dictionary:**
   - Open `src/lib/i18n/translations.ts`.
   - Add tool slug to `toolTranslations.es` and `toolTranslations.pt` with:
     - `name`: Localized short tool name.
     - `title`: High-CTR localized `<title>` tag.
     - `description`: Localized meta description.
     - `features`: Array of localized highlights.
     - `howToUse`: Array of step objects (`{ step, description }`).
     - `faqs`: Array of localized FAQ objects (`{ question, answer }`).
2. **Register in Localized Route:**
   - Open `src/app/[lang]/[tool]/page.tsx`.
   - Add dynamic import: `const NewToolClient = dynamic(() => import("@/app/new-tool/NewToolClient"));`
   - Map slug in `TOOL_COMPONENTS`: `"new-tool": NewToolClient`.
3. **Update Pings:**
   - Add `"/es/<tool-slug>"` and `"/pt/<tool-slug>"` to `scripts/ping-search-engines.mjs` and `src/lib/indexnow.ts`.
4. **Verification:**
   - Run `npm run build` to confirm static pre-rendering passes for all localized paths.

---

## Runbook 4: Generative Engine Optimization (GEO) & LLM Indexing

When adding new capabilities or tools:

1. **Update `public/llms.txt`:**
   - Add new tool bullet with URL and 1-sentence capability description.
2. **Update `public/llms-full.txt`:**
   - Add detailed section documenting endpoints, KaTeX formulas, supported formats, and privacy guarantees.
3. **Verify AI Crawler Access:**
   - Check `src/app/robots.ts` to ensure new routes are not inadvertently blocked for `OAI-SearchBot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, etc.

---

## Runbook 5: Mathematical, Timezone & Core Logic Standards

1. **Investment Growth Math:**
   - Always model recurring contributions as monthly deposits ($12 \times PMT$/yr).
   - In daily compounding, compound balance daily ($365/yr$) while adding contributions monthly.
   - Enforce monotonic ordering: $Daily > Monthly > Quarterly > Annually$.

2. **Timezone-Safe Date Arithmetic:**
   - Never use `new Date("YYYY-MM-DD")` directly for date calculations because ISO date-only strings parse to UTC midnight and roll back 1 day in negative UTC offsets (Americas).
   - Use `parseLocalDate(str)` and `formatLocalDate(date)` for local midnight dates.
   - Use `Date.UTC(y, m, d)` for day duration math to be 100% immune to 23h/25h Daylight Saving Time (DST) shifts.

3. **Measurement Precision:**
   - Use `formatNumber()` with `toPrecision(6)` fallback for small values ($< 10^{-6}$) and large values ($\ge 10^{10}$) to avoid rounding non-zero numbers to `"0"`.

4. **Division-by-Zero Safety:**
   - In `PxToRemClient.tsx`, clamp `baseSize > 0`.
   - In `FireCalculatorClient.tsx`, clamp inflation denominator `Math.max(0.01, 1 + inflation/100)`.

5. **LaTeX Template Literal Escaping & Control Character Safety:**
   - In JavaScript/TypeScript template literals (`src/lib/blog-data.ts`), **ALWAYS** use double backslashes for LaTeX commands: `\\frac`, `\\text`, `\\times`, `\\log`, `\\approx`, `\\sqrt`, `\\le`, `\\ge`, `\\pm`, `\\cdot`, etc.
   - **Critical Pitfall:** In JS template literals, `\f` evaluates to Form Feed (`\x0c`) and `\t` evaluates to Tab (`\x09`). If written with single backslashes (`\frac`, `\text`), the runtime string receives `\x0crac` and `\x09ext`, breaking KaTeX parsing.
   - In `src/app/blog/[slug]/page.tsx`, `sanitizeMath()` filters non-printable ASCII control characters (`\x00`–`\x1F` except `\n`, `\r`) before passing strings to `katex.renderToString()`.
   - In client components, `<MathFormula formula="..." />` defensively normalizes double backslashes via `.replace(/\\\\([a-zA-Z]+)/g, "\\$1")` so formulas render correctly whether passed with single or double backslashes.
   - **Markdown Inline Code in Template Literals:** When writing backtick snippets inside template literals, format carefully (e.g. `(\`\` \`\`\` \`\`)`) to prevent premature termination of template literals.

---

## Runbook 6: Category Pillar Hub Pages

1. Create `src/app/category/<category-slug>/page.tsx`.
2. Use `CategoryHubLayout.tsx`.
3. Register `"/category/<category-slug>"` in `categoryHubs` in `src/app/sitemap.ts`.

---

## Runbook 7: SaaS Alternative Comparison Pages

1. Create `src/app/vs/<competitor-slug>/page.tsx`.
2. Use `ComparisonLayout.tsx`.
3. Register `"/vs/<competitor-slug>"` in `comparisonPages` in `src/app/sitemap.ts` and `src/components/Footer.tsx`.

---

## Runbook 8: Writing & Publishing an In-Depth Guide

1. Open `src/lib/blog-data.ts`.
2. Add an entry to `blogPosts`:
   - `slug`: kebab-case URL identifier.
   - `title`: High-intent headline.
   - `excerpt`: 1–2 sentence compelling summary.
   - `date`: Current ISO date string.
   - `author`: Always `"The Utilify Editorial Team"`.
   - `readTime`: Estimated reading time.
   - `category`: `"Productivity" | "Design" | "Finance" | "Development" | "PDF"`.
   - `content`: 800+ words of markdown structured with `###` headings, comparison tables, step-by-step instructions, KaTeX equations, and internal links.

3. **Editorial & Math Formatting Rules:**
   - **Zero Foreign Boilerplate:** Never paste UI widgets, file dropzone HTML, or filler text from other tools into articles.
   - **LaTeX Formulas:** Always use double backslashes (`\\frac{A}{B}`, `\\text{Years}`) for block math `$$...$$` and inline math `\(...\)` or `$..$`.
   - **Code Blocks in Template Strings:** Escape inline backticks carefully to avoid breaking the surrounding TypeScript template literal.

4. **Verify Build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## Runbook 9: Search Engine & IndexNow Submission

1. **Automated Submission on Build:**
   Runs automatically via `npm run build` (`postbuild` hook in `package.json`). Submits 206 URLs.
2. **Manual CLI Submission:**
   ```bash
   npm run ping
   ```
3. **On-Demand API:**
   - `GET https://www.theutilify.com/api/indexnow?action=submit-all`

---

## Runbook 10: Adding Backend Microservices (`/backend`)

When a tool requires heavy server-side computation (ONNX AI inference, PyMuPDF, Playwright):

1. Add async endpoint in `backend/main.py`:
   ```python
   @app.post("/custom-tool/action")
   async def custom_tool_action(file: UploadFile = File(...)):
       if not file.filename.endswith(".ext"):
           raise HTTPException(status_code=400, detail="Invalid file format.")
       
       file_bytes = await file.read()
       # Process purely in-memory using io.BytesIO()
       output_buffer = io.BytesIO()
       # ... execute transformation ...
       output_buffer.seek(0)
       
       return StreamingResponse(
           output_buffer,
           media_type="application/octet-stream",
           headers=format_content_disposition("result.ext", as_attachment=True)
       )
   ```
2. In frontend client, call endpoint via `uploadToBackend("/custom-tool/action", [file])` from `@/lib/api`.

---

## Runbook 11: Community Ratings & Google Cloud Firestore

1. **Architecture & Storage:**
   - Ratings stored in Google Cloud Firestore in collection `ratings` with document ID = `<tool-slug>`.
   - Cloud Run backend connects via `google-cloud-firestore` with Google Application Default Credentials (ADC).
   - In local development, falls back automatically to local file cache (`_resolve_ratings_file()`).
2. **Submitting Ratings:**
   - `POST /api/rate` with `{ "tool": "slug", "rating": 5 }` executes atomic increments (`firestore.Increment`).
3. **Authenticity Policy:**
   - Only 100% genuine user votes are permitted. Pre-seeded reviews are strictly prohibited.

---

## Runbook 12: Cloud Run Operations & Cost Control

1. **Dynamic Port Binding (`PORT`):**
   - Cloud Run allocates dynamic ports. Container CMD in `Dockerfile` must use:
     ```dockerfile
     CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
     ```
2. **Artifact Registry Cost Optimization:**
   - Configure a 2-rule automated Cleanup Policy in Google Cloud Console Artifact Registry (`cloud-run-source-deploy`):
     - **Rule 1 (Keep Recent):** Keep most recent versions (Keep count: 2).
     - **Rule 2 (Delete Stale):** Conditional delete (Any tag state, older than 7 days).
3. **Unicode Filename Compliance:**
   - Always wrap file download headers with `format_content_disposition(filename)` in `backend/main.py`.

---

## Runbook 13: Verification & Deployment

1. **Verify Frontend Locally:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```
   Ensure 0 TypeScript errors, clean static generation for all 115+ SSG routes, and successful execution of `postbuild` search engine pinging (206 URLs).

2. **Verify Backend Locally:**
   ```powershell
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload --port 8000
   ```

3. **Deploy:**
   Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin main
   ```
   - Vercel automatically deploys the frontend.
   - Google Cloud automatically builds and deploys the backend to Cloud Run.
