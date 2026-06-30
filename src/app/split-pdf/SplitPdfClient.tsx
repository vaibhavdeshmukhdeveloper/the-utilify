"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Scissors, Download, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SplitPdfClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [pages, setPages] = useState("1-2");
  const [splitMode, setSplitMode] = useState("range"); // "range" or "all"
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    if (isLoading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading]);

  const handleUpload = async (files: File[]) => {
    if (splitMode === "range" && !pages.trim()) {
      toast.error("Please enter page ranges (e.g., 1,2,5-8)");
      return;
    }

    const file = files[0];
    setFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await uploadToBackend("/pdf/split", files, { 
        pages: splitMode === "all" ? "all" : pages 
      });
      setResult(data);
      toast.success(splitMode === "all" ? "PDF split into individual pages!" : "PDF ranges extracted successfully!");
    } catch (error: any) {
      console.error("Split error:", error);
      toast.error(error.message || "Failed to split PDF. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const howToUse = [
    { step: "Choose Mode", description: "Select 'Extract Ranges' for specific pages, or 'Split All' for individual files." },
    { step: "Upload PDF", description: "Select the PDF file you want to process." },
    { step: "Download", description: "Get your split PDF or a ZIP archive containing all pages." },
  ];

  const faqs = [
    { 
      question: "What is the difference between 'Extract Ranges' and 'Split All Pages'?", 
      answer: "'Extract Ranges' allows you to select specific pages (e.g. 1-3, 5) and merges them into a single new PDF. 'Split All Pages' splits every single page of your PDF into an individual separate file and bundles them in a ZIP." 
    },
    { 
      question: "Can I enter non-consecutive page numbers?", 
      answer: "Yes, you can combine single pages and ranges using commas, for example: '1, 3, 5-8, 12'. The output document will contain exactly these pages in the order specified." 
    },
    { 
      question: "Is there a limit to the size of the PDF file I can split?", 
      answer: "No. Our backend processes file actions in highly optimized server threads. However, extremely large files (e.g. 200MB+) might take slightly longer to upload and process." 
    },
    {
      question: "Are my confidential files stored on your servers?",
      answer: "No. Security is our priority. Your documents are uploaded, processed in transient RAM, and immediately deleted. We never store files on physical hard drives or databases."
    },
    {
      question: "Will the formatting or links inside the PDF change?",
      answer: "No. The splitting process is completely lossless. It retains all vector graphics, fonts, text layers, hyperlinks, form fields, and metadata completely intact."
    },
    {
      question: "Is this tool completely free to use?",
      answer: "Yes. Utilify provides free, unlimited document splitting with no hidden costs, caps on page counts, or watermarks."
    }
  ];

  const relatedTools = [
    { name: "Merge PDF", href: "/merge-pdf" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Splitting PDFs and Extracting Specific Pages</h3>
      <p>
        PDF files are commonly used for heavy consolidated reports, books, contracts, and legal papers. Sharing a massive document when you only need to submit a few specific pages is a bad practice. It is safer, faster, and more professional to extract exactly the page ranges you need.
      </p>
      <h4>When to Use the Split PDF Tool</h4>
      <ul>
        <li><strong>Redacting Unwanted Pages:</strong> Remove personal details, price charts, or audit sheets from business contracts.</li>
        <li><strong>Reducing File Sizes:</strong> Extract a single chapter from a massive academic textbook to read on your tablet or share via email.</li>
        <li><strong>Isolating Invoices:</strong> Separate monthly billing statements from a yearly consolidated file for accounting submissions.</li>
      </ul>
      <h4>How to Write Page Ranges Correctly</h4>
      <p>
        Our parser supports standard indexing symbols. Separate page ranges with hyphens and individual pages with commas:
      </p>
      <ul>
        <li><code>1-5</code>: Extracts pages 1, 2, 3, 4, and 5.</li>
        <li><code>3, 7, 9</code>: Extracts only pages 3, 7, and 9.</li>
        <li><code>1-4, 8, 12-15</code>: Extracts pages 1 to 4, page 8, and pages 12 to 15, merging them into one output file.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages or split every page into individual PDF files instantly."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Config & Upload */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <Card className="p-8 space-y-8 border-2 shadow-sm rounded-[2rem]">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Scissors className="h-4 w-4" /> Select Split Mode
              </Label>
              <Tabs defaultValue="range" onValueChange={setSplitMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
                  <TabsTrigger value="range" className="text-xs font-bold rounded-lg">Extract Ranges</TabsTrigger>
                  <TabsTrigger value="all" className="text-xs font-bold rounded-lg">Split All Pages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="range" className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Page Ranges</Label>
                    <Input 
                      placeholder="e.g. 1, 3, 5-10" 
                      value={pages} 
                      onChange={(e) => setPages(e.target.value)}
                      className="h-14 text-lg font-bold rounded-2xl border-2 focus:border-primary transition-all"
                    />
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-2">
                      <Info className="h-3 w-3" /> Creates <strong>one</strong> PDF with selected pages.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="all" className="pt-6">
                   <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                      <Layers className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-xs text-primary/80 font-medium leading-relaxed">
                        This will create <strong>individual PDF files</strong> for every page and bundle them into a ZIP.
                      </p>
                   </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="pt-6 border-t">
              <FileUploader
                label={`Upload to ${splitMode === "all" ? "Split Every Page" : "Extract Ranges"}`}
                accept={{ "application/pdf": [".pdf"] }}
                onUpload={handleUpload}
                isLoading={isLoading}
                hideDownload={true}
              />
            </div>
          </Card>
          
          {fileInfo && (
            <Card className="p-6 rounded-2xl border-2 flex items-center gap-4 bg-white dark:bg-zinc-950 shadow-sm animate-in fade-in slide-in-from-left-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-sm">{fileInfo.name}</p>
                <p className="text-xs text-muted-foreground">{fileInfo.size}</p>
              </div>
              {result && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </Card>
          )}
        </div>

        {/* Right Column: Results */}
        <div ref={resultsRef} className="lg:col-span-7 scroll-mt-24">
          {isLoading ? (
            <Card className="h-[400px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <Scissors className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">
                {splitMode === "all" ? "Splitting Every Page..." : "Extracting Ranges..."}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                {splitMode === "all" 
                  ? "We're generating separate files for each page. Please wait."
                  : `We're extracting pages ${pages} into a new document.`}
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <Card className="p-10 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Download className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-green-500 mb-4">
                    <CheckCircle2 className="h-4 w-4" /> Success
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">
                    {splitMode === "all" ? "ZIP Archive is Ready!" : "Your Split PDF is Ready!"}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <Download className="mr-2 h-6 w-6" /> Download {splitMode === "all" ? "ZIP Archive" : "Split PDF"}
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      onClick={() => {setResult(null); setFileInfo(null);}} 
                      className="h-16 px-8 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900"
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-none rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600">
                  {splitMode === "all" ? <Layers className="h-5 w-5" /> : <Scissors className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mode Applied</p>
                  <p className="font-bold">{splitMode === "all" ? "Split into Individual Pages" : `Extracted Pages: ${pages}`}</p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-card rounded-[3rem]">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <Scissors className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">How should we split?</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                Choose between extracting specific ranges or splitting every page into its own file.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Select a mode on the left
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
