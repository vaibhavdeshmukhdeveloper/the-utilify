"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { FileImage, Download, Layers, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PdfToImageClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string; pages?: number } | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    setFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });

    setIsLoading(true);
    setResult(null);

    try {
      const data = await uploadToBackend("/pdf/to-image", files);
      setResult(data);
      toast.success("PDF converted to images successfully!");
    } catch (error: any) {
      console.error("Conversion error:", error);
      toast.error(error.message || "Failed to convert PDF. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const howToUse = [
    { step: "Upload PDF", description: "Select the PDF file you want to convert into images." },
    { step: "AI Processing", description: "Our engine extracts every page as a high-quality PNG." },
    { step: "Instant Download", description: "Get a ZIP archive containing all your images in seconds." },
  ];

  const faqs = [
    {
      question: "What is the output image quality?",
      answer: "We use high-density rendering (2x scale) to ensure your images are crisp and readable, even for small text."
    },
    {
      question: "How are multiple pages handled?",
      answer: "If your PDF has multiple pages, they are bundled into a single ZIP file for easy downloading."
    },
    {
      question: "Is there a page limit?",
      answer: "No hard limit, but very large PDFs (100+ pages) may take a few extra seconds to process."
    },
  ];

  const relatedTools = [
    { name: "Split PDF", href: "/split-pdf" },
    { name: "Merge PDF", href: "/merge-pdf" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert every page of your PDF into high-quality PNG images instantly. Perfect for presentations and social media."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-2 border-dashed bg-card rounded-[2rem]">
            <FileUploader
              label="Upload PDF"
              accept={{ "application/pdf": [".pdf"] }}
              onUpload={handleUpload}
              isLoading={isLoading}
              hideDownload={true} // We'll show the result in the right column
            />
          </Card>

          {fileInfo && (
            <Card className="p-6 rounded-2xl border-2 flex items-center gap-4 bg-card shadow-sm animate-in fade-in slide-in-from-left-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileImage className="h-6 w-6" />
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
        <div className="lg:col-span-7">
          {isLoading ? (
            <Card className="h-[400px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <Layers className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2 text-foreground">Converting PDF...</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                We're extracting high-quality images from each page. This usually takes 3-10 seconds depending on size (first run may take slightly longer).
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <Card className="p-10 bg-primary text-primary-foreground border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Download className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] mb-4">
                    <CheckCircle2 className="h-4 w-4" /> Conversion Complete
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">Your images are ready!</h2>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-primary-foreground/20">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all bg-background text-foreground hover:bg-background/90">
                        <Download className="mr-2 h-6 w-6" /> Download All (ZIP)
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      onClick={() => { setResult(null); setFileInfo(null); }}
                      className="h-16 px-8 rounded-2xl border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      Convert Another
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-card border rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Format</p>
                    <p className="font-bold text-foreground">PNG (High-Res)</p>
                  </div>
                </Card>
                <Card className="p-6 bg-card border rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</p>
                    <p className="font-bold text-foreground">Ready to Save</p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-card rounded-[2.5rem]">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <FileImage className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2 text-foreground">No file uploaded yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Once you upload your PDF, you'll be able to download each page as an individual image.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Select a PDF to begin
              </div>
            </Card>
          )}

          {/* Error fallback */}
          {!isLoading && !result && fileInfo && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Something went wrong. Please check your file size or ensure the backend server is online.</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
