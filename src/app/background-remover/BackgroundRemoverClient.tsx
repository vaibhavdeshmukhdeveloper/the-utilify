"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Download, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2, Maximize2, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackgroundRemoverClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: string } | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [refineEdges, setRefineEdges] = useState(true);
  const [resolutionMode, setResolutionMode] = useState<"standard" | "original">("standard");
  const [modelMode, setModelMode] = useState<"u2net" | "u2net_human_seg" | "u2net_cloth_seg">("u2net");

  const resizeImageIfNeeded = (file: File, maxDim = 2048): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { width, height } = img;
        if (width <= maxDim && height <= maxDim) {
          resolve(file);
          return;
        }

        let newWidth = width;
        let newHeight = height;
        if (width > height) {
          if (width > maxDim) {
            newHeight = Math.round((height * maxDim) / width);
            newWidth = maxDim;
          }
        } else {
          if (height > maxDim) {
            newWidth = Math.round((width * maxDim) / height);
            newHeight = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const resizedFile = new File([blob], file.name, {
            type: file.type || "image/png",
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, file.type || "image/png", 0.95);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
    });
  };

  const handleReset = () => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setResult(null);
    setOriginalFile(null);
    setOriginalUrl(null);
    setUploaderKey(prev => prev + 1);
  };

  const handleUpload = async (files: File[]) => {
    let fileToUpload = files[0];
    
    setIsLoading(true);
    setResult(null);

    if (resolutionMode === "standard") {
      try {
        fileToUpload = await resizeImageIfNeeded(fileToUpload, 2048);
      } catch (err) {
        console.error("Client side resize error:", err);
      }
    }

    setOriginalFile({
      name: fileToUpload.name,
      size: (fileToUpload.size / (1024 * 1024)).toFixed(2) + " MB"
    });

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    const url = URL.createObjectURL(fileToUpload);
    setOriginalUrl(url);

    try {
      const data = await uploadToBackend("/image/remove-bg", [fileToUpload], {
        post_process: refineEdges ? "true" : "false",
        model: modelMode
      });
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
      answer: "Our AI is trained on millions of high-resolution images. It handles complex edges like hair, clothing outlines, and fine textures with professional precision."
    },
    {
      question: "What is the output format?",
      answer: "We always output transparent PNG files with a full alpha channel. This ensures you can seamlessly layer your subject onto any custom background."
    },
    {
      question: "Are there limits on resolution?",
      answer: "We support images up to 4K resolution. High-resolution images are processed at their original fidelity without downscaling."
    },
    {
      question: "Is my private data uploaded to a third party?",
      answer: "No. Your image is processed transiently in RAM on our secure cloud server. It is wiped immediately after processing is complete. We do not store or inspect your files."
    },
    {
      question: "Can I remove backgrounds from graphics or logos?",
      answer: "Yes! Our AI is highly optimized for portraits and products, but it also works very well for solid logo boundaries, vector objects, and artwork icons."
    },
    {
      question: "Is there a limit on how many images I can process?",
      answer: "No. Utilify provides completely free, unlimited background removal. You can process as many images as you need without signup or subscription limits."
    }
  ];

  const relatedTools = [
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Split PDF", href: "/split-pdf" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: AI-Powered Image Segmentation</h3>
      <p>
        The Utilify Background Remover leverages state-of-the-art computer vision models trained specifically to isolate foreground subjects from complex backgrounds. The neural network calculates a high-resolution alpha matte to identify transparency values on every pixel.
      </p>
      <h4>How to Get the Best Results</h4>
      <p>
        To ensure pixel-perfect removal, we recommend:
      </p>
      <ul>
        <li><strong>High Contrast:</strong> Choose photos where the subject has a distinct color from the backdrop.</li>
        <li><strong>Clear Focus:</strong> Avoid strong motion blur around the edges of the subject.</li>
        <li><strong>Proper Lighting:</strong> Natural lighting helps the AI identify edge details, especially around hair.</li>
      </ul>
      <h4>Common Use Cases</h4>
      <p>
        This tool is highly optimized for:
      </p>
      <ul>
        <li><strong>E-Commerce Sellers:</strong> Create clean white or transparent product listings for Amazon, Shopify, or Etsy.</li>
        <li><strong>LinkedIn Profiles:</strong> Isolate portrait photos to create professional headshots with custom backdrops.</li>
        <li><strong>Graphic Designers:</strong> Speed up your editing workflow by generating transparent cutouts in seconds instead of drawing manual paths.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove image backgrounds automatically in seconds. Powered by professional-grade AI for pixel-perfect results."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-2 border-dashed bg-card rounded-[2.5rem]">
            <FileUploader
              key={uploaderKey}
              label="Upload Image"
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              onUpload={handleUpload}
              isLoading={isLoading}
              hideDownload={true}
            />
          </Card>

          <Card className="p-6 border-2 bg-card rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black tracking-tight m-0">AI Processing Settings</h3>
            </div>
            
            {/* Resolution selection */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                Target Resolution
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResolutionMode("standard")}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 text-center flex flex-col justify-center items-center gap-1 ${
                    resolutionMode === "standard"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-extrabold text-sm">Standard (2K)</span>
                  <span className="text-[10px] opacity-80">Faster upload & run</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionMode("original")}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border-2 text-center flex flex-col justify-center items-center gap-1 ${
                    resolutionMode === "original"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-extrabold text-sm">Original Size</span>
                  <span className="text-[10px] opacity-80">Full resolution</span>
                </button>
              </div>
            </div>

            {/* Subject Mode Selection */}
            <div className="space-y-3 pt-2 border-t">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                Subject Type
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setModelMode("u2net")}
                  className={`py-2 px-1 rounded-lg text-center flex flex-col justify-center items-center gap-0.5 border transition-all ${
                    modelMode === "u2net"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-extrabold text-[11px] leading-tight">General</span>
                  <span className="text-[9px] opacity-75 leading-tight">Products/Auto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModelMode("u2net_human_seg")}
                  className={`py-2 px-1 rounded-lg text-center flex flex-col justify-center items-center gap-0.5 border transition-all ${
                    modelMode === "u2net_human_seg"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-extrabold text-[11px] leading-tight">Portraits</span>
                  <span className="text-[9px] opacity-75 leading-tight">People only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModelMode("u2net_cloth_seg")}
                  className={`py-2 px-1 rounded-lg text-center flex flex-col justify-center items-center gap-0.5 border transition-all ${
                    modelMode === "u2net_cloth_seg"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-zinc-200 dark:border-zinc-800 bg-muted/30 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-extrabold text-[11px] leading-tight">Clothing</span>
                  <span className="text-[9px] opacity-75 leading-tight">Fashion items</span>
                </button>
              </div>
            </div>

            {/* Edge Refinement Toggle */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Edge Optimization
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Refine mask borders (e.g. hair details)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRefineEdges(prev => !prev)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                    refineEdges ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      refineEdges ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
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
            <Card className="p-4 bg-muted border-none rounded-2xl flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">AI Powered</span>
            </Card>
            <Card className="p-4 bg-muted border-none rounded-2xl flex items-center gap-3">
              <Maximize2 className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold text-foreground">Full Resolution</span>
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
                <Card className="p-4 bg-card border-2 rounded-[2.5rem] overflow-hidden relative flex flex-col justify-between">
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
                <Card className="p-4 bg-card border-2 rounded-[2.5rem] overflow-hidden relative flex flex-col justify-between">
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
                      className="h-16 px-8 rounded-2xl border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-900 hover:text-white font-bold transition-all duration-300"
                    >
                      Process Another
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-card rounded-[2.5rem]">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
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
