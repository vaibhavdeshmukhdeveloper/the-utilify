"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Download, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2, Maximize2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackgroundRemoverClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: string } | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const handleReset = () => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setResult(null);
    setOriginalFile(null);
    setOriginalUrl(null);
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    setOriginalFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await uploadToBackend("/image/remove-bg", files);
      setResult(data);
      toast.success("Background removed successfully!");
    } catch (error: any) {
      console.error("BG Removal error:", error);
      toast.error(error.message || "Failed to remove background. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const howToUse = [
    { step: "Upload Photo", description: "Select any image with a person, product, or clear subject." },
    { step: "AI Analysis", description: "Our neural network detects and isolates the foreground instantly." },
    { step: "Save PNG", description: "Download your professional-grade image with full transparency." },
  ];

  const faqs = [
    { 
      question: "How accurate is the AI?", 
      answer: "Our AI is trained on millions of high-resolution images. It handles complex edges like hair and fur with professional precision." 
    },
    { 
      question: "What is the output format?", 
      answer: "We always provide a transparent PNG to ensure you can layer your subject onto any background." 
    },
    { 
      question: "Are there limits on resolution?", 
      answer: "We support images up to 4K resolution. For larger files, the processing may take a few seconds longer." 
    },
  ];

  const relatedTools = [
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Split PDF", href: "/split-pdf" },
  ];

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove image backgrounds automatically in seconds. Powered by professional-grade AI for pixel-perfect results."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-2 border-dashed bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem]">
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
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-sm">{originalFile.name}</p>
                <p className="text-xs text-muted-foreground">{originalFile.size}</p>
              </div>
              {result && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold">AI Powered</span>
            </Card>
            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-3">
              <Maximize2 className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold">Full Resolution</span>
            </Card>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6">
                <Loader2 className="h-20 w-20 text-primary animate-spin" />
                <Sparkles className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Removing Background...</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                Our AI neural network is isolating the subject from your image. This usually takes 4-10 seconds depending on size (first request may take slightly longer as the model initializes).
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Preview */}
                <Card className="p-4 bg-zinc-100/50 dark:bg-zinc-900/30 border-2 rounded-[2.5rem] overflow-hidden relative flex flex-col justify-between">
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-zinc-950/80 text-zinc-50 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Original
                  </div>
                  <div className="p-4 min-h-[350px] flex items-center justify-center">
                    {originalUrl && (
                      <img 
                        src={originalUrl} 
                        alt="Original Upload" 
                        className="max-w-full max-h-[350px] object-contain rounded-2xl shadow-md"
                      />
                    )}
                  </div>
                </Card>

                {/* Background Removed */}
                <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-2 rounded-[2.5rem] overflow-hidden relative flex flex-col justify-between">
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Background Removed
                  </div>
                  {/* Transparency Grid Pattern */}
                  <div 
                    className="absolute inset-4 rounded-[1.5rem] opacity-40 dark:opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                  <div className="relative z-10 p-4 min-h-[350px] flex items-center justify-center">
                    <img 
                      src={result.url} 
                      alt="Removed Background" 
                      className="max-w-full max-h-[350px] object-contain drop-shadow-2xl"
                    />
                  </div>
                </Card>
              </div>

              <Card className="p-10 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-green-500 mb-4">
                    <Zap className="h-4 w-4" /> AI Transformation Ready
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">Pixel-perfect transparency.</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <Download className="mr-2 h-6 w-6" /> Download (PNG)
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      onClick={handleReset} 
                      className="h-16 px-8 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white"
                    >
                      Process Another
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-zinc-50/50 rounded-[2.5rem]">
              <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Ready for AI Magic?</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                Once you upload a photo, our AI will instantly strip the background and give you a high-res transparent PNG.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Select a photo to begin
              </div>
            </Card>
          )}

          {!isLoading && !result && originalFile && (
             <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Something went wrong. Please check your image size or ensure the backend server is online.</span>
             </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
