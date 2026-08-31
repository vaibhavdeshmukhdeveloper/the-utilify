import { Metadata } from "next";
import { CategoryHubLayout, CategoryToolItem, CategoryFaqItem } from "@/components/CategoryHubLayout";

export const metadata: Metadata = {
  title: "Free Online PDF Tools Suite - Split, Merge, Convert & Compile PDFs | Utilify",
  description: "The complete, privacy-first online PDF tool suite. Merge multiple PDFs, split page ranges from bank statements, convert PDF to JPG/PNG, and compile Markdown to PDF. 100% free with zero file retention.",
  alternates: {
    canonical: "/category/pdf-tools",
  },
  openGraph: {
    title: "Free Online PDF Tools Suite | Utilify",
    description: "Merge, split, render, and compile PDF documents in seconds without software installs or file uploads to persistent disks.",
    url: "https://www.theutilify.com/category/pdf-tools",
    siteName: "Utilify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools Suite | Utilify",
    description: "Zero-storage, high-speed PDF operations: split, merge, convert, and format.",
  },
};

const pdfTools: CategoryToolItem[] = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF documents, invoices, and receipts into a single master PDF with drag-and-drop page ordering.",
    href: "/merge-pdf",
    badge: "Popular",
    features: [
      "Drag-and-drop chronological reordering",
      "Unlimited file attachments",
      "Fast RAM stream processing",
    ],
  },
  {
    title: "Split PDF",
    description: "Extract specific page ranges or individual sheets from large mortgage papers, bank statements, and legal contracts.",
    href: "/split-pdf",
    badge: "High Privacy",
    features: [
      "Custom page range syntax (e.g. 1-3, 5, 8-10)",
      "Instant in-memory isolation",
      "Protects confidential financial history",
    ],
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages into crystal-clear PNG or high-DPI JPG images suitable for presentations, LinkedIn posts, and ATS portals.",
    href: "/pdf-to-image",
    badge: "High DPI",
    features: [
      "High-density rasterization",
      "Selective page rendering",
      "Download individual images or batch ZIP",
    ],
  },
  {
    title: "Markdown to PDF",
    description: "Compile Markdown text and files into formatted, styled PDF documents with syntax-highlighted code blocks and tables.",
    href: "/markdown-to-pdf",
    badge: "Developer Ready",
    features: [
      "Live split-screen preview",
      "Syntax highlighting for code snippets",
      "Print-optimized page margins and fonts",
    ],
  },
];

const pdfFaqs: CategoryFaqItem[] = [
  {
    question: "Is there a file size or page limit when merging or splitting PDFs on Utilify?",
    answer: "No. Unlike legacy converter sites that cap free usage at 2 files or charge monthly subscriptions for large documents, Utilify provides unlimited batch processing 100% free of charge.",
  },
  {
    question: "Are my confidential PDF documents stored on your servers?",
    answer: "Never. All PDF operations execute inside transient, in-memory RAM streams. Once your converted document is streamed back to your browser, all memory buffers are wiped immediately with strict garbage collection. We maintain zero persistent hard drive storage.",
  },
  {
    question: "Can I use Utilify's PDF tools on mobile phones and tablets?",
    answer: "Yes. Our tools are fully responsive and optimized for mobile browsers, iPhones, iPads, and Android devices without requiring any app installations.",
  },
];

export default function PdfToolsCategoryPage() {
  return (
    <CategoryHubLayout
      categoryName="PDF &amp; Document Tools"
      categorySlug="pdf-tools"
      headline="Free Online PDF Tools Suite"
      subheadline="Split, merge, convert, and compile PDF documents instantly with zero file retention and no software installs."
      description="The complete privacy-first suite of free online PDF utilities. Merge, split, convert PDF to images, and compile markdown to PDF without storing files."
      tools={pdfTools}
      faqs={pdfFaqs}
      detailedContent={
        <div>
          <h2>Why Professionals Choose Utilify for PDF Manipulation</h2>
          <p>
            For years, manipulating PDF files online required uploading sensitive contracts, tax records, and personal identification to legacy converter platforms. Many of these platforms store user files on persistent cloud storage for days, throttle batch processing behind paywalls, or attach intrusive watermarks.
          </p>
          <p>
            <strong>The Utilify</strong> was engineered from the ground up to solve these vulnerabilities:
          </p>
          <ul>
            <li><strong>Zero Storage Policy:</strong> We operate on a strict privacy-first model. Files are processed entirely in transient RAM and deleted instantaneously upon transmission.</li>
            <li><strong>No Account Barriers:</strong> You never need to create an account, provide an email address, or enter credit card credentials to process high-resolution documents.</li>
            <li><strong>High-Speed Engine:</strong> Powered by modern PyMuPDF microservices and client-side web technologies, operations complete in milliseconds rather than minutes.</li>
          </ul>
        </div>
      }
    />
  );
}
