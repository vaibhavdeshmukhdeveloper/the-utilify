"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Download, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2, Minimize2, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageCompressorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string; originalSize: string; compressedSize: string } | null>(null);
  const [quality, setQuality] = useState([80]);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: string } | null>(null);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    setOriginalFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });

    setIsLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality[0].toString());

      const response = await fetch("/api/image-compressor", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Compression failed");

      const blob = await response.blob();
      const compressedSize = (blob.size / (1024 * 1024)).toFixed(2) + " MB";
      const url = window.URL.createObjectURL(blob);
      
      setResult({ 
        url, 
        filename: `compressed_${file.name}`,
        originalSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        compressedSize 
      });
      toast.success("Image compressed successfully!");
    } catch (error: any) {
      console.error("Compression error:", error);
      toast.error(error.message || "Failed to compress image");
    } finally {
      setIsLoading(false);
    }
  };

  const howToUse = [
    { step: "Upload Image", description: "Select the JPG, PNG, or WebP image you want to compress." },
    { step: "Adjust Quality", description: "Use the slider to set your desired balance between size and quality." },
    { step: "Download", description: "Download your optimized image instantly." },
  ];

  const faqs = [
    { 
      question: "Will I lose image quality during compression?", 
      answer: "We employ advanced lossy and lossless algorithms. When compressing at the default 80% quality level, file size is reduced by up to 80% while the visual difference remains completely indistinguishable to the human eye." 
    },
    { 
      question: "Which file formats are supported?", 
      answer: "We support the three major web image formats: JPEG/JPG, PNG, and WebP. Transparent layers inside PNG and WebP files are fully preserved." 
    },
    { 
      question: "Is there a limit on upload file size?", 
      answer: "Our compressor supports images up to 20MB in size. Very large high-resolution camera photos are optimized in seconds." 
    },
    {
      question: "Are my uploaded photos stored on your servers?",
      answer: "No. Security is part of our design system. All files are uploaded and optimized in-memory (RAM) and immediately purged upon download. We never save your private photos."
    },
    {
      question: "How does the quality slider affect file size?",
      answer: "Lowering the slider increases compression strength, yielding smaller file sizes but potentially introducing compression artifacts. Keeping the slider between 70% and 85% is ideal for the web."
    },
    {
      question: "Do you support batch image compression?",
      answer: "Currently, our tool processes images one by one to ensure maximum optimization accuracy for each file. You can refresh and compress as many files as you like."
    }
  ];

  const relatedTools = [
    { name: "Background Remover", href: "/background-remover" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Split PDF", href: "/split-pdf" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Squeezing Web Graphics for Performance</h3>
      <p>
        Uncompressed images are the leading cause of slow page speeds. When loading heavy 5MB photos onto web platforms like Shopify, WordPress, or custom portals, your users experience long load times, which can lead to higher bounce rates and poor SEO rankings. Image compression shrinks files while keeping visual structures clean.
      </p>
      <h4>Understanding Image Compression Formats</h4>
      <ul>
        <li><strong>JPEG Compression:</strong> Eliminates high-frequency noise that is hard for the human eye to detect. Perfect for photos.</li>
        <li><strong>PNG Compression:</strong> Squeezes color palettes and removes redundant pixel patterns without discarding details, maintaining crisp text outlines and transparent backdrops.</li>
        <li><strong>WebP Compression:</strong> A modern Google standard combining the best features of both, yielding files up to 30% smaller than JPEGs.</li>
      </ul>
      <h4>How to Balance Quality vs. File Size</h4>
      <p>
        For standard web storefronts and email attachments, setting the compression quality slider to <strong>80%</strong> offers the perfect sweet spot. This provides significant weight savings (often reducing a 3MB file to less than 400KB) while ensuring graphics look completely crisp and clear on high-resolution screens.
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size instantly without losing visible quality. Perfect for web optimization."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Upload and Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-2 border-dashed bg-card rounded-[2.5rem] space-y-8">
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Compression Quality: {quality[0]}%
                </label>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {quality[0] < 50 ? "High Compression" : quality[0] < 80 ? "Balanced" : "High Quality"}
                </span>
              </div>
              <Slider 
                value={quality} 
                onValueChange={(val) => setQuality(Array.isArray(val) ? val : [val])} 
                max={100} 
                min={10} 
                step={1} 
                className="py-4"
              />
            </div>
            
            <FileUploader
              label="Upload Image"
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              onUpload={handleUpload}
              isLoading={isLoading}
              hideDownload={true}
            />
          </Card>
          
          {originalFile && (
            <Card className="p-6 rounded-2xl border-2 flex items-center gap-4 bg-white dark:bg-zinc-950 shadow-sm animate-in fade-in slide-in-from-left-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-sm">{originalFile.name}</p>
                <p className="text-xs text-muted-foreground">{originalFile.size}</p>
              </div>
              {result && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-3">
              <Minimize2 className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold leading-tight">Reduce Size</span>
            </Card>
            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-xs font-bold leading-tight">Keep Quality</span>
            </Card>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6">
                <Loader2 className="h-20 w-20 text-primary animate-spin" />
                <Minimize2 className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Compressing Image...</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                We are optimizing your image to reduce file size while maintaining visual fidelity.
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <Card className="p-4 bg-card border-2 rounded-[2.5rem] overflow-hidden relative group">
                <div className="relative z-10 p-4 min-h-[400px] flex items-center justify-center">
                  <img 
                    src={result.url} 
                    alt="Compressed Image" 
                    className="max-w-full max-h-[450px] object-contain drop-shadow-2xl rounded-xl"
                  />
                </div>
              </Card>

              <Card className="p-10 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Minimize2 className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-green-500 mb-4">
                    <Zap className="h-4 w-4" /> Optimization Complete
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">Ready for the web.</h2>
                  
                  <div className="flex gap-8 mb-8 pb-8 border-b border-zinc-800">
                    <div>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Original Size</p>
                      <p className="text-xl font-bold text-zinc-300">{result.originalSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-500 font-medium uppercase tracking-wider mb-1">Compressed Size</p>
                      <p className="text-xl font-bold text-green-400">{result.compressedSize}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <Download className="mr-2 h-6 w-6" /> Download Image
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      onClick={() => {setResult(null); setOriginalFile(null);}} 
                      className="h-16 px-8 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900"
                    >
                      Process Another
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-card rounded-[2.5rem]">
              <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Compress Without Compromise</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                Adjust the quality slider and upload your image. We'll instantly process it and provide a lightweight, high-quality result.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Select a photo to begin
              </div>
            </Card>
          )}

          {!isLoading && !result && originalFile && (
             <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Something went wrong. Please try again.</span>
             </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
