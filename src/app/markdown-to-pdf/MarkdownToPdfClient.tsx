"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Type, 
  Sparkles, 
  Download, 
  Trash2, 
  FileCode, 
  Columns, 
  Eye, 
  Edit3, 
  Settings,
  CheckCircle2,
  RefreshCw,
  Zap,
  BookOpen
} from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

const SAMPLE_MARKDOWN = `# Utilify Professional Report

Welcome to the **Utilify Markdown to PDF** converter! This real-time editor allows you to compose documents in Markdown and instantly see how they look formatted.

## Key Features

- **Real-time Preview:** See your design change as you type.
- **Multiple Templates:** Switch between Academic, Modern, Developer, and Editorial formats.
- **Zero Cost:** Absolutely free with 100% data privacy.

### Sample Table

| Metric | Utilify Platform | Other Sites |
| :--- | :--- | :--- |
| **Processing Speed** | Instant (2-3s) | Confusing & Slow |
| **Privacy Policy** | 100% RAM processed | Persistent storage |
| **Visual Aesthetics** | Premium & Clean | Cluttered with Ads |

### Blockquote Example

> "Simplicity is the ultimate sophistication. By removing the clutter, we allow the ideas to stand out clearly."

### Monospace Code Block

\`\`\`javascript
// Quick conversion example
const convert = async (markdown) => {
  const pdf = await utilify.convertToPdf(markdown);
  return pdf.download();
};
\`\`\`

Enjoy writing beautiful documents!`;

type ThemeType = "default" | "academic" | "developer" | "editorial";
type ViewMode = "split" | "editor" | "preview";

export default function MarkdownToPdfClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [htmlContent, setHtmlContent] = useState("");
  const [activeTheme, setActiveTheme] = useState<ThemeType>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const actionAreaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && actionAreaRef.current) {
      actionAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    if (isLoading && actionAreaRef.current) {
      actionAreaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading]);

  // Client-side marked rendering to prevent Next.js SSR hydration mismatches
  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const rawHtml = await marked(markdown);
        setHtmlContent(rawHtml);
      } catch (err) {
        console.error("Marked parsing error:", err);
      }
    };
    renderMarkdown();
  }, [markdown]);

  // Dynamically load KaTeX and auto-render math formulas in the client preview
  useEffect(() => {
    if (!htmlContent) return;

    const renderKaTeX = async () => {
      if (!document.getElementById("katex-css")) {
        const link = document.createElement("link");
        link.id = "katex-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
        document.head.appendChild(link);
      }

      if (!(window as any).katex) {
        const script1 = document.createElement("script");
        script1.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
        script1.defer = true;
        document.head.appendChild(script1);

        await new Promise((res) => { script1.onload = res; });

        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js";
        script2.defer = true;
        document.head.appendChild(script2);

        await new Promise((res) => { script2.onload = res; });
      }

      if ((window as any).renderMathInElement && previewRef.current) {
        (window as any).renderMathInElement(previewRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
        });
      }
    };

    renderKaTeX();
  }, [htmlContent]);

  const handleUpload = async (files: File[]) => {
    setIsLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("theme", activeTheme);

      const response = await fetch("/api/markdown-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setResult({ url, filename: `${files[0].name.split(".")[0] || "document"}.pdf` });
      toast.success("Markdown converted to PDF successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to convert Markdown file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextConvert = async () => {
    if (!markdown.trim()) {
      toast.error("Please enter some markdown content first");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("markdown", markdown);
      formData.append("theme", activeTheme);

      const response = await fetch("/api/markdown-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setResult({ url, filename: "document.pdf" });
      toast.success("PDF generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to convert Markdown");
    } finally {
      setIsLoading(false);
    }
  };

  const howToUse = [
    { step: "Choose Style", description: "Select from Modern, Academic, Developer, or Editorial templates." },
    { step: "Compose / Upload", description: "Write directly in our editor or upload a .md file." },
    { step: "Download PDF", description: "Generate and instantly save your perfectly compiled A4 document." },
  ];

  const faqs = [
    { 
      question: "Which Markdown syntax extensions are supported?", 
      answer: "We support the standard GitHub Flavored Markdown (GFM) specification. This includes tables, checklist boxes, strikethroughs, inline HTML blocks, blockquotes, numbered/unordered lists, and pre-formatted syntax code sections." 
    },
    { 
      question: "How do the visual templates work?", 
      answer: "Our rendering pipeline maps Markdown elements directly to custom CSS themes. The compiled pages utilize standard print layouts with calculated top and bottom margins to prevent headers or footers from clipping." 
    },
    { 
      question: "Is my personal document cached or saved?", 
      answer: "No. Privacy is our top concern. All text compile streams and file uploads are processed fully in RAM on temporary sandbox instances. Files are deleted immediately after download." 
    },
    {
      question: "Can I print the generated PDF on physical A4 paper?",
      answer: "Yes! The output PDF is compiled specifically with A4 document print parameters, matching standard paper sizes and incorporating standard margins perfect for resumes, specifications, and reports."
    },
    {
      question: "Does the PDF support code syntax coloring?",
      answer: "Yes. Selecting the 'Sleek Developer' theme or using code blocks in the default themes automatically colors code snippets (e.g. JavaScript, Python, JSON) for high readability."
    },
    {
      question: "Can I convert local markdown files (.md) directly?",
      answer: "Yes. You can compose in the editor or drag and drop local files ending in '.md' or '.markdown' into the file uploader below the editor to convert them."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Split PDF", href: "/split-pdf" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Compiling Plain Text Markdown into PDFs</h3>
      <p>
        Markdown is a lightweight markup language that allows writers and developers to compose documents in plain text that translates cleanly to HTML or print formats. By separating document structure from styling rules, Markdown prevents layout shifting commonly caused by rich-text software.
      </p>
      <h4>Overview of the Compilation Themes</h4>
      <p>
        Utilify provides four distinct styling templates designed for different business objectives:
      </p>
      <ul>
        <li><strong>Modern Clean:</strong> The default style. Minimal layout using sans-serif typography, ideal for reports, product specifications, and general documentation.</li>
        <li><strong>Academic Report:</strong> Employs Times New Roman, justified alignments, and standard margins suitable for college research, thesis notes, and academic journals.</li>
        <li><strong>Sleek Developer:</strong> A programming-oriented theme featuring a dark background and distinct code blocks, perfect for API schemas, script tutorials, and developer specs.</li>
        <li><strong>Editorial Vintage:</strong> Uses Georgia serif typography and elegant dashed separators, giving it a classic newsletter or publication feel.</li>
      </ul>
      <h4>High-Fidelity PDF Generation</h4>
      <p>
        To ensure print quality, our server-side compiler uses headless Chromium to render the styled layout before compiling the page into a PDF. This ensures that fonts, tables, margins, and page breaks are rendered exactly as they appear in the editor.
      </p>
    </article>
  );

  // Theme descriptions
  const themes = [
    { id: "default", name: "Modern Clean", desc: "Sleek, sans-serif typography with professional margins." },
    { id: "academic", name: "Academic Report", desc: "Justified Times New Roman typography with elegant formatting." },
    { id: "developer", name: "Sleek Developer", desc: "Monospace code structure styled in custom dark theme." },
    { id: "editorial", name: "Editorial Vintage", desc: "Georgia serif body font with dashed accent dividers." }
  ];

  return (
    <ToolLayout
      title="Markdown to PDF"
      description="Convert raw Markdown text or uploaded files into stunning, print-ready PDF documents. Choose templates, edit in real-time, and download instantly."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Toolbar Controls */}
        <Card className="p-4 rounded-3xl flex flex-wrap gap-4 items-center justify-between shadow-sm bg-card border-2">
          {/* Left Side: View Modes */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-muted-foreground mr-2 tracking-wider">Workspace:</span>
            <Button 
              variant={viewMode === "split" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="h-9 px-3 rounded-xl gap-1.5"
            >
              <Columns className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-bold">Split View</span>
            </Button>
            <Button 
              variant={viewMode === "editor" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("editor")}
              className="h-9 px-3 rounded-xl gap-1.5"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-bold">Editor Only</span>
            </Button>
            <Button 
              variant={viewMode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="h-9 px-3 rounded-xl gap-1.5"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-bold">Preview Only</span>
            </Button>
          </div>

          {/* Center: Template Styles */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-muted-foreground mr-2 tracking-wider">Template Style:</span>
            <div className="flex gap-1.5 bg-zinc-50 dark:bg-zinc-900 p-1 rounded-2xl border">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTheme(t.id as ThemeType);
                    setResult(null);
                  }}
                  className={cn(
                    "px-3 h-8 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all",
                    activeTheme === t.id 
                      ? "bg-white dark:bg-zinc-950 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Quick Action utilities */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setMarkdown(SAMPLE_MARKDOWN); 
                setResult(null); 
                toast.info("Sample template loaded!");
              }}
              title="Reload sample markdown"
              className="h-9 w-9 rounded-xl"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setMarkdown(""); 
                setResult(null); 
                toast.info("Workspace cleared!");
              }}
              title="Clear editor"
              className="h-9 w-9 text-destructive rounded-xl hover:bg-destructive/5"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Markdown Editor */}
          <Card className={cn(
            "rounded-[2.5rem] overflow-hidden bg-card shadow-xl transition-all duration-300 border-2",
            viewMode === "editor" ? "lg:col-span-12" : viewMode === "preview" ? "hidden" : "lg:col-span-6"
          )}>
            <CardHeader className="border-b px-8 py-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black tracking-tight">Markdown Compose Panel</CardTitle>
                <CardDescription className="text-xs">Type raw markdown with standard headers, tables, and lists</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                <FileCode className="h-3 w-3" /> EDITOR
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              <textarea
                className="w-full min-h-[500px] h-[550px] p-8 font-mono text-[13px] leading-relaxed resize-y bg-zinc-50/30 dark:bg-zinc-950/20 text-foreground focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                placeholder="# Compose your markdown document here..."
                value={markdown}
                onChange={(e) => {
                  setMarkdown(e.target.value);
                  setResult(null);
                }}
              />
            </CardContent>
          </Card>

          {/* Right Column: Live A4 Simulation Preview */}
          <Card className={cn(
            "rounded-[2.5rem] overflow-hidden bg-card shadow-inner min-h-[640px] flex flex-col transition-all duration-300 border-2",
            viewMode === "preview" ? "lg:col-span-12" : viewMode === "editor" ? "hidden" : "lg:col-span-6"
          )}>
            <CardHeader className="border-b bg-white dark:bg-zinc-950/50 px-8 py-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black tracking-tight">Live A4 Preview</CardTitle>
                <CardDescription className="text-xs">Approximate rendered formatting of your print layout</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider">
                <Eye className="h-3 w-3" /> PREVIEW
              </div>
            </CardHeader>
            
            {/* Scrollable Document Container */}
            <CardContent className="p-8 flex-grow overflow-y-auto max-h-[550px] flex justify-center">
              {/* Simulated Page A4 */}
              <div className={cn(
                "w-full max-w-[800px] shadow-lg rounded-2xl p-10 min-h-[500px] border border-zinc-200/50 overflow-x-auto",
                activeTheme === "default" && "bg-white theme-default",
                activeTheme === "academic" && "bg-white theme-academic",
                activeTheme === "developer" && "bg-zinc-950 theme-developer",
                activeTheme === "editorial" && "bg-[#faf8f5] theme-editorial"
              )}>
                {htmlContent ? (
                  <div ref={previewRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                  <p className="text-muted-foreground italic text-center py-20 text-sm">No content composed to preview...</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Generate / Action Area */}
        <div ref={actionAreaRef} className="max-w-3xl mx-auto pt-6 scroll-mt-24">
          {isLoading ? (
            <Card className="p-8 border-2 border-primary/20 bg-primary/5 rounded-[2.5rem] text-center shadow-lg animate-pulse">
              <div className="relative mb-4 flex justify-center">
                <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-1">Generating PDF...</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Using Playwright headless Chromium for high-fidelity A4 rendering. This usually takes 3-10 seconds depending on size (first compile may take slightly longer).
              </p>
            </Card>
          ) : result ? (
            <Card className="p-8 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle2 className="h-24 w-24 text-green-400" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase tracking-[0.4em] text-green-500 mb-2">
                    <Zap className="h-4 w-4" /> COMPILATION COMPLETE
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Your PDF is ready!</h2>
                  <p className="text-zinc-400 text-sm mt-1">{result.filename}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a href={result.url} download={result.filename}>
                    <Button className="h-14 px-8 text-md font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">
                      <Download className="mr-2 h-5 w-5" /> Download PDF
                    </Button>
                  </a>
                  <Button 
                    variant="outline" 
                    onClick={() => setResult(null)} 
                    className="h-14 px-6 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900"
                  >
                    Modify Document
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleTextConvert} 
                className="w-full h-16 text-lg font-black rounded-2xl shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all"
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" /> Compile & Generate A4 PDF
              </Button>
              
              <div className="text-center py-4 text-xs text-muted-foreground">
                — OR —
              </div>
              
              <Card className="p-8 border-2 border-dashed bg-card rounded-[2.5rem]">
                <FileUploader
                  label="Or Upload .md / .markdown file"
                  accept={{ "text/markdown": [".md", ".markdown"] }}
                  onUpload={handleUpload}
                  isLoading={isLoading}
                  hideDownload={true}
                />
              </Card>
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}
