export interface UseCaseData {
  slug: string;
  baseTool: "background-remover" | "pdf-to-image" | "split-pdf" | "merge-pdf" | "image-compressor" | "markdown-to-pdf" | "sip-calculator" | "investment-calculator" | "bmi-calculator" | "json-formatter";
  title: string;
  seoTitle: string;
  seoDescription: string;
  heading: string;
  introduction: string;
  category: string;
  tips: string[];
}

export const useCases: UseCaseData[] = [
  // 1. AI Background Remover Use Cases
  {
    slug: "remove-background-jewelry-photos-shopify",
    baseTool: "background-remover",
    title: "AI Jewelry Photo Background Remover",
    seoTitle: "Remove Background from Jewelry Photos (Shopify Ready)",
    seoDescription: "Automatically remove backgrounds from jewelry, ring, and crystal product photos. Get instant, high-fidelity transparent PNGs ready for Shopify or Etsy.",
    heading: "Remove Background from Jewelry Photos",
    introduction: "Selling glossy rings, delicate necklaces, and high-end jewelry online requires flawless product shots. Our AI background remover maintains smooth contours around metal, diamond facets, and chains, delivering perfectly transparent PNG product cutouts.",
    category: "Image",
    tips: [
      "AI Precision: Designed to retain highlights and gloss edges around complex metallic textures.",
      "High Export Resolution: Keep images crisp and professional to build high buyer trust.",
      "Shopify Optimization: Run your final output through our Image Compressor before uploading to Shopify for maximum load speeds."
    ]
  },
  {
    slug: "remove-background-car-photos-dealership",
    baseTool: "background-remover",
    title: "Auto Car Photo Background Remover",
    seoTitle: "Remove Background from Car Photos Online (Dealerships)",
    seoDescription: "Automate background removal for auto dealership car and vehicle inventory photos. Get professional transparent cutouts instantly.",
    heading: "Remove Background from Car Photos",
    introduction: "Clean, consistent automotive inventory directories drive higher vehicle leads. Instantly isolate cars, SUVs, and trucks from busy showroom or street backgrounds to overlay them onto branded dealership templates.",
    category: "Image",
    tips: [
      "Perfect Shadows: Detects car tire boundaries accurately to avoid floating-car effects.",
      "Batch Ready: Load your next car photos directly into the uploader zone.",
      "Dealership Branding: Transparent outputs make it easy to drop vehicles into catalog banners."
    ]
  },
  {
    slug: "make-signature-background-transparent",
    baseTool: "background-remover",
    title: "Make Signature Background Transparent Online",
    seoTitle: "Make Signature Background Transparent (Convert JPG to PNG)",
    seoDescription: "Upload a photo of your signature and convert it into a clean, transparent PNG image. Perfect for digital signing on PDFs, Word docs, and contracts.",
    heading: "Make Signature Background Transparent",
    introduction: "Need to digitally sign an email, letter, or official contract? Upload a photo or scan of your handwritten pen signature. Our instant flood-fill isolator strips off paper shadows and gray background tints, giving you a clean black ink signature PNG.",
    category: "Image",
    tips: [
      "Instant Crop: Erases uneven scanner margins and desk shadow gradients automatically.",
      "Vector Quality: Extracts absolute black ink pixels while smoothing out written lines.",
      "Private signing: Processed entirely in-memory — your private signature never hits persistent disk storage."
    ]
  },
  {
    slug: "make-logo-background-transparent-png",
    baseTool: "background-remover",
    title: "Make Logo Background Transparent Online",
    seoTitle: "Convert Logo Background to Transparent PNG Online",
    seoDescription: "Instantly remove white or solid color backgrounds from company logos, icons, and vectors. High-fidelity transparent PNG output.",
    heading: "Make Logo Background Transparent",
    introduction: "Don't overlay logos with ugly white boxes onto your website header, email signature, or presentation slides. Our instant mathematical vector flood-fill removes solid flat backgrounds with pixel-perfect transparency in milliseconds.",
    category: "Image",
    tips: [
      "Vector Precision: Perfectly handles internal white gaps (like loops in letters A, O, R).",
      "High Fidelity: Keeps company branding colors perfectly intact without color bleeding.",
      "Format conversion: JPG logos are instantly converted into transparent alpha-channel PNGs."
    ]
  },

  // 2. PDF to Image Use Cases
  {
    slug: "convert-bank-statement-pdf-to-jpg",
    baseTool: "pdf-to-image",
    title: "Bank Statement PDF to Secure JPG Converter",
    seoTitle: "Convert Bank Statement PDF to JPG Online (100% Private)",
    seoDescription: "Safely convert bank statements, salary slips, and financial PDF files into high-resolution JPG or PNG images. Processed entirely in-memory.",
    heading: "Secure Bank Statement PDF to JPG Converter",
    introduction: "Many banks, loan providers, and mortgage applications require uploading salary and bank statements as JPG or PNG images instead of PDFs to prevent editing. Our secure, memory-only extractor renders each statement page as a high-density, crystal-clear image in seconds.",
    category: "PDF",
    tips: [
      "Security First: Your statement is processed entirely in transient RAM and streamed back instantly. We never write your files to disk or database.",
      "High Density: Renders at 2x resolution to ensure tiny financial numbers and tables remain fully legible."
    ]
  },
  {
    slug: "convert-pdf-invoice-to-png-image",
    baseTool: "pdf-to-image",
    title: "PDF Invoice to PNG Image Converter",
    seoTitle: "Convert PDF Invoice to PNG Image Free & Online",
    seoDescription: "Convert business invoices, receipts, and order summaries from PDF to PNG images. Premium resolution for e-commerce, records, and accounting.",
    heading: "Convert PDF Invoice to PNG Image",
    introduction: "Need to upload customer invoices or receipt files directly to expense sheets, accounting tools, or e-commerce records? Easily convert raw document PDF pages into separate PNG images.",
    category: "PDF",
    tips: [
      "Clear Text: Renders vector invoice blocks into clear, anti-aliased image pixels.",
      "Easy Archiving: Multiple invoice pages are automatically zipped into a single folder."
    ]
  },

  // 3. Split PDF Use Cases
  {
    slug: "extract-pages-from-bank-statement-pdf",
    baseTool: "split-pdf",
    title: "Extract Pages from Bank Statement PDF",
    seoTitle: "Extract Pages from Bank Statement PDF Free (Specific Pages)",
    seoDescription: "Isolate and extract specific months, ranges, or page numbers from a multi-page bank statement PDF safely. 100% private in-memory splitting.",
    heading: "Extract Specific Pages from Bank Statement",
    introduction: "Don't share your entire multi-year financial history with third parties. If a provider only asks for your 'last 3 months of bank statements', easily extract exactly those page numbers from your large PDF file safely and privately.",
    category: "PDF",
    tips: [
      "Custom Ranges: Extract custom indexing patterns (e.g. '1-3, 5, 8') in seconds.",
      "Privacy Protected: Statements are split entirely in RAM, so your financial details remain completely secure.",
      "No Quality Loss: Keeps original PDF layers, fonts, and structures perfectly intact."
    ]
  },
  {
    slug: "split-pdf-contract-into-single-pages",
    baseTool: "split-pdf",
    title: "Split PDF Contract into Single Pages",
    seoTitle: "Split PDF Contract into Single Pages Online & Free",
    seoDescription: "Extract single pages or individual signature sections from multi-page legal contracts, agreements, and real estate documents in-memory.",
    heading: "Split Legal Contracts into Single Pages",
    introduction: "Isolate singular signature sections, addendum blocks, or specific terms of service from heavy, multi-page business agreements and legal contracts with total precision.",
    category: "PDF",
    tips: [
      "Legal Standard: Preserves digital signature layers and vector formatting intact.",
      "Exact Page Extraction: Safely separate page 14 from page 15 without altering layouts."
    ]
  },

  // 4. Merge PDF Use Cases
  {
    slug: "combine-multiple-receipts-into-single-pdf",
    baseTool: "merge-pdf",
    title: "Combine Receipts into Single PDF",
    seoTitle: "Combine Multiple Receipts into a Single PDF Online",
    seoDescription: "Merge digital receipts, tax invoices, and booking confirmations into one organized PDF file. Streamline business expense filings.",
    heading: "Combine Expense Receipts into a Single PDF",
    introduction: "Filing expense reports or submitting company sheets? Don't upload dozen of individual receipts. Upload all your PNG, JPG, or PDF business invoice receipts and combine them into a single, perfectly structured PDF report.",
    category: "PDF",
    tips: [
      "Tax Ready: Perfect for organizing invoices, receipts, W2s, and annual accounts.",
      "Simple Order: Files are combined in the exact order you upload them."
    ]
  },
  {
    slug: "merge-pdf-forms-for-tax-filing",
    baseTool: "merge-pdf",
    title: "Merge PDF Tax Forms Online",
    seoTitle: "Merge PDF Tax Forms & W2s Online (Secure)",
    seoDescription: "Combine multiple tax documents, W2 slips, and salary records into a single secure PDF file in-memory. Zero file retention guaranteed.",
    heading: "Merge PDF Forms for Tax Filing",
    introduction: "Submitting annual accounts, corporate tax records, or income filings? Merge your independent tax PDFs, W-2 forms, and schedule lists securely in one file to make accounting effortless.",
    category: "PDF",
    tips: [
      "100% Secure: Financial details are never cached, saved, or inspected by our servers.",
      "Accurate Merging: Combines text elements, metadata fields, and charts precisely."
    ]
  },

  // 5. Image Compressor Use Cases
  {
    slug: "compress-image-for-passport-application",
    baseTool: "image-compressor",
    title: "Compress Image for Passport Application",
    seoTitle: "Compress Passport & Visa Application Photos (Under 100KB)",
    seoDescription: "Compress passport photos, ID scans, and visa photographs to meet official online portals limit (under 50KB or 100KB) with zero quality loss.",
    heading: "Compress Image for Passport & Visa Applications",
    introduction: "Official online passport systems, government portals, and visa applications have strict image file size limits (usually under 50KB, 100KB, or 200KB). Shrink the file size of your portrait or document scan in seconds while keeping the image completely sharp and readable.",
    category: "Image",
    tips: [
      "Zero Quality Loss: Maintains visual facial details and scan text perfectly clean.",
      "Portal Compliant: Easily squeeze JPGs or PNGs into custom file sizes instantly.",
      "Standard formats: Fully supports passport JPG, JPEG, and PNG formats."
    ]
  },

  // 6. Markdown to PDF Use Cases
  {
    slug: "convert-github-readme-to-beautiful-pdf",
    baseTool: "markdown-to-pdf",
    title: "GitHub README Markdown to PDF Converter",
    seoTitle: "Convert GitHub README Markdown to PDF Online (Stunning Theme)",
    seoDescription: "Convert markdown (.md) documents and Github Readme structures into beautifully formatted PDF documents in-memory. Playwright Chromium rendering.",
    heading: "Convert GitHub README to Beautiful PDF",
    introduction: "Want to print out your software documentation, code specs, or a GitHub repository README file into a clean, modern PDF document? Paste your raw markdown or upload your `.md` file, and compile it into a beautifully styled document with premium code syntax highlighting.",
    category: "PDF",
    tips: [
      "Professional Layouts: Applies a clean tech-pro font family and spacing templates.",
      "Pixel-Perfect: Employs headless Chromium page setups to render elements exactly as they look in a browser."
    ]
  },
  {
    slug: "convert-markdown-resume-to-clean-pdf",
    baseTool: "markdown-to-pdf",
    title: "Markdown Resume to PDF Converter",
    seoTitle: "Convert Markdown Resume to Clean PDF (A4 Ready)",
    seoDescription: "Write or paste your markdown resume / CV and convert it into a beautifully formatted A4 PDF. Headless browser quality.",
    heading: "Convert Markdown Resume to Clean PDF",
    introduction: "Tired of bloated Word formatting breaking your resume lines? Write your CV in standard markdown. Paste it, choose layout margins, and print it to a clean, professional, and minimal A4 PDF ready for job applications.",
    category: "PDF",
    tips: [
      "Standard A4 Margins: Configured with 1cm printable bounds matching recruitment templates.",
      "Optimized Fonts: Styled with a modern, readable, and elegant geometric typography."
    ]
  },

  // 7. SIP Calculator Use Cases
  {
    slug: "calculate-mutual-fund-sip-returns",
    baseTool: "sip-calculator",
    title: "Mutual Fund SIP Wealth Calculator",
    seoTitle: "Mutual Fund SIP Calculator - Project Systematic Savings Wealth",
    seoDescription: "Calculate estimated compound returns, wealth gain, and maturity corpus of systematic investment plans (SIP) in mutual funds. Free wealth projections.",
    heading: "Mutual Fund SIP Wealth Calculator",
    introduction: "Planning to start monthly savings in an equity mutual fund or index fund? Estimate how small recurring allocations compound over 10, 20, or 30 years to create massive capital.",
    category: "Finance",
    tips: [
      "Compound Returns: Models index fund performance rates (e.g. 12% - 15% historical average).",
      "Goal Based: Easily check how much you need to save monthly to hit $1 Million."
    ]
  },
  {
    slug: "sip-calculator-for-retirement-wealth",
    baseTool: "sip-calculator",
    title: "Retirement Savings SIP Calculator",
    seoTitle: "Retirement Savings SIP Wealth Projector - Compound Wealth",
    seoDescription: "Project your retirement nest-egg using compounding systematic investments. Plan monthly contributions to secure your early retirement.",
    heading: "Retirement Savings SIP Calculator",
    introduction: "Secure your financial freedom. Project the power of systematic mutual fund compound growth to build your custom retirement nest-egg.",
    category: "Finance",
    tips: [
      "Early Retirement planning: Check how starting 5 years earlier exponentially grows your payout.",
      "Compound interest: Calculations reflect standard monthly compound accumulation rates."
    ]
  },

  // 8. Investment Calculator Use Cases
  {
    slug: "project-compound-interest-wealth-growth",
    baseTool: "investment-calculator",
    title: "Index Fund Compound Interest Growth Projector",
    seoTitle: "Long-Term Compound Interest Projector for Index Funds",
    seoDescription: "Calculate future wealth growth for lump-sum capital and monthly indexing contributions with custom compound frequencies.",
    heading: "Long-Term Index Fund Growth Projector",
    introduction: "Want to calculate the future returns of a lump sum stock portfolio combined with recurring monthly indexing contributions? Project your net worth curves under customizable compound frequencies (daily, monthly, yearly).",
    category: "Finance",
    tips: [
      "Custom compounding: Toggle daily, monthly, quarterly, or yearly interest accumulation.",
      "Inflation Aware: Visualizes compounding snowballs clearly to aid wealth planning."
    ]
  },

  // 9. BMI Calculator Use Cases
  {
    slug: "calculate-body-mass-index-health-range",
    baseTool: "bmi-calculator",
    title: "Body Mass Index & Weight Range Calculator",
    seoTitle: "Calculate Body Mass Index (BMI) & Ideal Weight Category",
    seoDescription: "Calculate your body mass index instantly with health category indicators and ideal weight suggestion bounds. Metric & imperial compatible.",
    heading: "Body Mass Index & Weight Category Calculator",
    introduction: "Assess your body mass index based on standard medical equations. Find out your healthy weight targets and review metric and imperial height and weight bounds.",
    category: "Health",
    tips: [
      "Standard Formula: Employs standard BMI (kg/m²) parameters approved by global health bodies.",
      "Healthy Range: Provides ideal weight ranges matching your height."
    ]
  },

  // 10. JSON Formatter Use Cases
  {
    slug: "prettify-nested-rest-api-json-payloads",
    baseTool: "json-formatter",
    title: "REST API JSON Payload Prettifier",
    seoTitle: "Prettify Nested REST API JSON Data (Online Formatter)",
    seoDescription: "Paste raw API payloads, nested strings, and minified JSON lists to validate, format, prettify, or minify them in real-time.",
    heading: "Prettify REST API JSON Payloads",
    introduction: "Developer workflow. Debug complex backend API responses, REST payloads, and stringified JSON logs instantly. Validate formatting, resolve missing commas, and pretty-print nodes.",
    category: "Developer",
    tips: [
      "Syntax Highlight: Full syntax highlighting to locate nested keys instantly.",
      "Validator: Pins down parsing errors with accurate line annotations."
    ]
  }
];
