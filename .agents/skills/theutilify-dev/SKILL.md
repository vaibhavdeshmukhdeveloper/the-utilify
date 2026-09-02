---
name: theutilify-dev
description: Developer runbooks and architectural guide for The Utilify web application (Next.js 16 App Router, FastAPI backend, Schema.org SEO, AdSense compliance, OpenGraph generator, category pillar hubs, competitor comparisons, programmatic long-tail pages, IndexNow search engine indexing, embeddable widgets, and deployment).
---

# The Utilify Developer & Engineering Runbooks

This skill provides step-by-step procedures for building, maintaining, and scaling tools, programmatic landing pages, category pillar hubs, competitor comparison pages, blog articles, and backend microservices on **The Utilify** (`https://www.theutilify.com`).

---

## Architecture Quick Reference

- **Frontend:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4.
- **Client Execution:** Client-side formats, encoders, calculators, QR generation (`qrcode`), Markdown parsing (`marked`), KaTeX formula cards (`katex`), PX to REM fluid generators, and batch image compression (`jszip` + Canvas API).
- **Dynamic OG Engine:** `/api/og` route built on `@vercel/og` Edge runtime for rich 1200x630 social sharing cards.
- **Dynamic RSS Feed:** `/feed.xml` route delivering automated RSS 2.0 channel updates for all 111+ blog publications.
- **Embed Engine:** `/embed/[tool]` route rendering responsive iframe widgets with canonical backlinks and modal snippet generator (`EmbedModal.tsx`).
- **Search Engine Automation:** `postbuild` script in `package.json` triggers `scripts/ping-search-engines.mjs` to dispatch 157+ URLs to IndexNow (`api.indexnow.org`, `yandex.com/indexnow`) and XML sitemap pings upon build/deploy.
- **Interactive UI Stack:** Global Command Palette (`Ctrl+K` / `Cmd+K`), Tool Workflow Chaining (`ToolWorkflowChaining.tsx`), Before/After Comparison Slider (`BeforeAfterSlider.tsx`), and Homepage Micro-Playground (`HeroPlayground.tsx`).
- **Backend:** FastAPI (Python 3.11) with PyMuPDF (`fitz`), Playwright Chromium Headless, and ONNX runtime (`rembg`).
- **Persistent Ratings Database:** Google Cloud Firestore (Native Mode, Always Free Tier) with atomic increments (`firestore.Increment`) for permanent authentic community ratings across serverless container restarts.
- **RFC 5987 / RFC 6266 Unicode Downloads:** `format_content_disposition()` delivering percent-encoded UTF-8 filename headers to prevent `latin-1` Starlette crashes.
- **Deployments:** Auto-deployed to Vercel (frontend) and Google Cloud Run (backend) upon push to `main`.

---

## Platform Catalog (27 Tools & Programmatic Pages Across 4 Categories)

| Category | Tools & Slugs |
| :--- | :--- |
| **PDF Operations (4)** | `/pdf-to-image`, `/split-pdf`, `/merge-pdf`, `/markdown-to-pdf` |
| **Image Processing (7)** | `/background-remover`, `/image-compressor`, `/color-palette`, `/compress-png`, `/compress-jpeg`, `/make-signature-transparent`, `/white-background-product-photos` |
| **Calculators & Math (6)** | `/sip-calculator`, `/investment-calculator`, `/fire-calculator`, `/bmi-calculator`, `/date-calculator`, `/age-calculator` |
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

## Runbook 1: Adding a New Utility Tool or Programmatic Page

Follow this procedure when creating a new tool or intent-specific landing page:

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
4. **Search Ping Engine:** Verify inclusion in `src/lib/indexnow.ts` and `scripts/ping-search-engines.mjs`.
5. **Command Palette:** If search keyword additions are needed, verify matching in `src/components/CommandPalette.tsx`.
6. **Embed Engine:** If client-side embeddable, add slug to `EMBEDDABLE_TOOLS` array in `src/app/embed/[tool]/page.tsx`.

---

## Runbook 2: Creating a Category Pillar Hub Page

When establishing high topical authority for a cluster of tools:

1. Create `src/app/category/<category-slug>/page.tsx`.
2. Use `CategoryHubLayout.tsx`:
   ```tsx
   import { Metadata } from "next";
   import { CategoryHubLayout } from "@/components/CategoryHubLayout";

   export const metadata: Metadata = {
     title: "Category Tools Suite - Free Online Utilities | Utilify",
     description: "Comprehensive suite of free online utilities for category tasks.",
     alternates: { canonical: "/category/<category-slug>" },
   };

   export default function CategoryPage() {
     return (
       <CategoryHubLayout
         title="Category Tools Suite"
         description="Category description..."
         categoryName="Category Name"
         tools={[
           { name: "Tool 1", href: "/tool-1", description: "...", icon: IconComponent },
         ]}
         faqs={[...]}
         editorialContent={<article>...</article>}
       />
     );
   }
   ```
3. Register `"/category/<category-slug>"` in `categoryHubs` in `src/app/sitemap.ts`.

---

## Runbook 3: Creating a SaaS Alternative Comparison Page

When targeting competitor comparison keywords (e.g. "The Utilify vs Competitor"):

1. Create `src/app/vs/<competitor-slug>/page.tsx`.
2. Use `ComparisonLayout.tsx`:
   ```tsx
   import { Metadata } from "next";
   import { ComparisonLayout, ComparisonRow, ComparisonFaq } from "@/components/ComparisonLayout";

   export const metadata: Metadata = {
     title: "Utilify vs Competitor - Free Alternative | Utilify",
     description: "Compare Utilify and Competitor. 100% free, unlimited, zero data retention.",
     alternates: { canonical: "/vs/<competitor-slug>" },
   };

   const tableRows: ComparisonRow[] = [
     { feature: "Pricing", utilify: "100% Free Forever", competitor: "Subscription Paywalls", highlight: true },
     { feature: "File Storage", utilify: "Zero Data Retention", competitor: "Cached on Server" },
   ];

   const faqs: ComparisonFaq[] = [
     { question: "Why switch to Utilify?", answer: "Zero fees, zero tracking, and instant processing." }
   ];

   export default function VsPage() {
     return (
       <ComparisonLayout
         competitorName="Competitor"
         competitorSlug="<competitor-slug>"
         headline="The Modern, Privacy-First Competitor Alternative"
         subheadline="Why professionals choose Utilify over Competitor."
         targetToolName="Tool Suite"
         targetToolHref="/target-tool"
         targetToolAction="Launch Tool"
         tableRows={tableRows}
         faqs={faqs}
       />
     );
   }
   ```
3. Register `"/vs/<competitor-slug>"` in `comparisonPages` in `src/app/sitemap.ts` and `src/components/Footer.tsx`.

---

## Runbook 4: Writing & Publishing an In-Depth Guide

When publishing long-tail search intent guides:

1. Open `src/lib/blog-data.ts`.
2. Add an entry to `blogPosts`:
   - `slug`: kebab-case URL identifier (e.g. `how-to-compress-images-for-web`).
   - `title`: High-intent headline.
   - `excerpt`: 1–2 sentence compelling summary.
   - `date`: Current ISO date string (e.g. `"2026-08-28"`).
   - `author`: Always `"The Utilify Editorial Team"`.
   - `readTime`: Estimated reading time (e.g. `"8 min read"`).
   - `category`: `"Productivity" | "Design" | "Finance" | "Development" | "PDF"`.
   - `content`: 800+ words of markdown structured with `###` headings, comparison tables, step-by-step instructions, KaTeX equations, and markdown links to related tools (`[Image Compressor](/image-compressor)`).
   *(Note: The dynamic RSS feed `/feed.xml` and automated IndexNow pings automatically index all new entries).*

---

## Runbook 5: Search Engine & IndexNow Submission

1. **Automated Submission on Build:**
   Runs automatically via `npm run build` (`postbuild` hook in `package.json`).
2. **Manual Submission:**
   ```bash
   npm run ping
   ```
3. **On-Demand API:**
   - `GET https://www.theutilify.com/api/indexnow?action=submit-all`

---

## Runbook 6: Adding Backend Microservices (`/backend`)

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
       
        headers=format_content_disposition("result.ext", as_attachment=True)
    )
```
2. In frontend client, call endpoint via `uploadToBackend("/custom-tool/action", [file])` from `@/lib/api`.

---

## Runbook 7: Community Ratings & Google Cloud Firestore

When maintaining or extending the ratings system:

1. **Architecture & Storage:**
   - Ratings are stored in Google Cloud Firestore in collection `ratings` with document ID = `<tool-slug>`.
   - Each document schema:
     ```json
     {
       "sum": 25,
       "count": 5,
       "last_updated": "2026-09-02T18:00:00Z"
     }
     ```
   - Cloud Run backend connects via `google-cloud-firestore` with Google Application Default Credentials (ADC).
   - In local development, falls back automatically to local file cache (`_resolve_ratings_file()`).

2. **Submitting Ratings:**
   - `POST /api/rate`:
     ```json
     { "tool": "background-remover", "rating": 5 }
     ```
   - Executes atomic increments (`firestore.Increment(rating)` and `firestore.Increment(1)`).

3. **Fetching Ratings:**
   - `GET /api/ratings?tool=<tool-slug>` returns `{ "tool": "slug", "ratingValue": 4.8, "reviewCount": 12 }`.
   - `GET /api/ratings` returns summary dictionary for all tools.

4. **Authenticity Policy:**
   - Ratings must reflect 100% genuine user votes. Fabricated or pre-seeded baseline reviews are strictly prohibited.
   - Search engine Schema.org `AggregateRating` is only attached when authentic reviews exist (`reviewCount > 0`).

---

## Runbook 8: Cloud Run Operations & Cost Control

1. **Dynamic Port Binding (`PORT`):**
   - Cloud Run allocates dynamic ports at container launch.
   - Container CMD in `Dockerfile` must use:
     ```dockerfile
     CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
     ```

2. **Artifact Registry Cost Optimization:**
   - To eliminate recurring storage costs from ~3 GB Docker images generated on every deploy:
   - Configure a 2-rule automated Cleanup Policy in Google Cloud Console Artifact Registry (`cloud-run-source-deploy`):
     - **Rule 1 (Keep Recent):** Keep most recent versions (Keep count: 2).
     - **Rule 2 (Delete Stale):** Conditional delete (Any tag state, older than 7 days).

3. **Unicode Filename Compliance:**
   - Always wrap file download headers with `format_content_disposition(filename)` in `backend/main.py`.
   - Starlette enforces `latin-1` byte headers; raw non-ASCII characters cause server 500 crashes.

---

## Runbook 9: Verification & Deployment

1. **Verify Frontend Locally:**
   ```bash
   npm run build
   ```
   Ensure 0 TypeScript errors, clean static page generation for all 72 routes, and successful execution of `postbuild` search engine pinging.

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
   - Vercel automatically builds and deploys the Next.js frontend.
   - Google Cloud automatically builds the Docker container and deploys the FastAPI backend to Cloud Run.

