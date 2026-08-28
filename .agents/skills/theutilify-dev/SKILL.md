---
name: theutilify-dev
description: Developer runbooks and architectural guide for The Utilify web application (Next.js 16 App Router, FastAPI backend, Schema.org SEO, AdSense compliance, OpenGraph generator, embeddable widgets, and deployment).
---

# The Utilify Developer & Engineering Runbooks

This skill provides step-by-step procedures for building, maintaining, and scaling tools, blog articles, and backend microservices on **The Utilify** (`https://www.theutilify.com`).

---

## Architecture Quick Reference

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- **Client Execution:** Client-side formats, encoders, calculators, batch image compressor (`jszip`), and KaTeX formula cards (`katex`).
- **Dynamic OG Engine:** `/api/og` route built on `@vercel/og` Edge runtime for rich 1200x630 social previews.
- **Embed Engine:** `/embed/[tool]` route rendering responsive iframe widgets with canonical backlinks.
- **Backend:** FastAPI (Python 3.11) with PyMuPDF (`fitz`), Playwright Chromium, and ONNX runtime (`rembg`).
- **Deployments:** Auto-deployed to Vercel (frontend) and Google Cloud (backend) upon push to `main`.

---

## Runbook 1: Adding a New Utility Tool

Follow this procedure when creating a new tool for the platform:

### 1. Create the Route Directory
Create `src/app/<tool-slug>/`:
- **`page.tsx`** (Server Component):
  ```tsx
  import { Metadata } from "next";
  import ToolClient from "./ToolClient";
  import { JsonLd } from "@/components/JsonLd";

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
    }
  };

  export default function Page() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Tool Name",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
    };
    return (
      <>
        <JsonLd data={schema} />
        <ToolClient />
      </>
    );
  }
  ```

- **`ToolClient.tsx`** (Client Component):
  Wrap with `ToolLayout`:
  ```tsx
  "use client";
  import { ToolLayout } from "@/components/ToolLayout";
  import { triggerConfetti } from "@/lib/confetti";

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
        {/* Interactive Tool Widget */}
      </ToolLayout>
    );
  }
  ```

### 2. Register in Sitemap, Home Grid & Embed Route
- Add `/<tool-slug>` to `tools` array in `src/app/sitemap.ts`.
- Add tool card definition to `src/components/ToolsGrid.tsx`.
- If client-side embeddable, register in `EMBEDDABLE_TOOLS` inside `src/app/embed/[tool]/page.tsx`.

---

## Runbook 2: Writing & Publishing an In-Depth Guide

When targeting a new long-tail search intent:

1. Open `src/lib/blog-data.ts`.
2. Add an entry to `blogPosts`:
   - `slug`: kebab-case URL identifier (e.g. `how-to-compress-images-web-performance`).
   - `title`: High-intent headline (e.g. *"How to Optimize Images for Web Performance"*).
   - `excerpt`: 1–2 sentence compelling summary.
   - `date`: Current date string (e.g. `"August 28, 2026"`).
   - `author`: Always `"The Utilify Editorial Team"`.
   - `readTime`: Estimated reading time (e.g. `"8 min read"`).
   - `category`: `"Productivity" | "Design" | "Finance" | "Development" | "PDF"`.
   - `content`: 800+ words of markdown structured with `###` headings, comparison tables, step-by-step instructions, and markdown links to related tools (`[Image Compressor](/image-compressor)`). Note: escape any backticks inside template literals as `\``.

---

## Runbook 3: Adding Backend Microservices (`/backend`)

When a tool requires Python computation (ONNX AI inference, PyMuPDF, Playwright):

1. Add async endpoint in `backend/main.py`:
   ```python
   @app.post("/api/custom-tool")
   async def custom_tool_endpoint(file: UploadFile = File(...)):
       content = await file.read()
       # Process purely in-memory using io.BytesIO()
       output_stream = io.BytesIO()
       # ... perform operations ...
       output_stream.seek(0)
       return StreamingResponse(
           output_stream,
           media_type="application/octet-stream",
           headers={"Content-Disposition": f"attachment; filename=result.ext"}
       )
   ```
2. In frontend client, use `uploadToBackend("/api/custom-tool", formData)` from `src/lib/api.ts`.

---

## Runbook 4: Verification & Deployment

1. **Verify Frontend Locally:**
   ```bash
   npm run build
   ```
   Ensure 0 TypeScript errors and clean static page generation for all routes.

2. **Deploy:**
   Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin main
   ```
   - Vercel automatically builds and deploys the frontend.
   - Google Cloud automatically builds the Docker container and deploys the backend.
