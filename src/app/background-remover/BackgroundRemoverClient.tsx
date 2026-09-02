"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Download, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2, Maximize2, Zap, Settings, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { triggerCelebration, triggerConfetti } from "@/lib/confetti";

export interface BackgroundRemoverClientProps {
  initialBgMode?: "transparent" | "white" | "black" | "blue" | "sunset" | "neon";
  initialModel?: "isnet-general-use" | "silueta" | "u2net" | "u2net_human_seg" | "u2net_cloth_seg";
  customTitle?: string;
  customDescription?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
}

export default function BackgroundRemoverClient({
  initialBgMode = "transparent",
  initialModel = "isnet-general-use",
  customTitle,
  customDescription,
  customHowToUse,
  customFaqs,
}: BackgroundRemoverClientProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: string } | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [refineEdges, setRefineEdges] = useState(false);
  const [resolutionMode, setResolutionMode] = useState<"standard" | "original">("standard");
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");
  const [modelMode, setModelMode] = useState<"isnet-general-use" | "silueta" | "u2net" | "u2net_human_seg" | "u2net_cloth_seg">(initialModel);
  const [bgPreviewMode, setBgPreviewMode] = useState<"transparent" | "white" | "black" | "blue" | "sunset" | "neon">(initialBgMode);
  const [applyShadow, setApplyShadow] = useState(false);

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

  // Manual Eraser Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushPos, setBrushPos] = useState<{ x: number; y: number } | null>(null);
  const [isEditorImageLoading, setIsEditorImageLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCoordsRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isEditing && result && canvasRef.current) {
      setIsEditorImageLoading(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = result.url;
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setIsEditorImageLoading(false);
      };
      img.onerror = () => {
        setIsEditorImageLoading(false);
        toast.error("Failed to load image for editing");
      };
    }
  }, [isEditing, result]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const draw = (x: number, y: number, lastX?: number, lastY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    
    if (typeof lastX === "number" && typeof lastY === "number") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize * 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    setIsDrawing(true);
    lastCoordsRef.current = coords;
    
    const canvas = canvasRef.current;
    if (!("touches" in e) && canvas) {
      const container = canvas.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setBrushPos({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        });
      }
    } else {
      setBrushPos(null);
    }
    
    draw(coords.x, coords.y);
  };

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    if ("touches" in e) {
      setBrushPos(null);
    }
    
    const lastCoords = lastCoordsRef.current;
    if (lastCoords) {
      draw(coords.x, coords.y, lastCoords.x, lastCoords.y);
    } else {
      draw(coords.x, coords.y);
    }
    lastCoordsRef.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastCoordsRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setBrushPos({
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top
      });
    } else {
      setBrushPos({
        x: e.clientX,
        y: e.clientY
      });
    }
    
    if (isDrawing) {
      const coords = getCoordinates(e);
      if (coords) {
        const lastCoords = lastCoordsRef.current;
        if (lastCoords) {
          draw(coords.x, coords.y, lastCoords.x, lastCoords.y);
        } else {
          draw(coords.x, coords.y);
        }
        lastCoordsRef.current = coords;
      }
    }
  };

  const getVisualBrushRadius = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width) return brushSize;
    const rect = canvas.getBoundingClientRect();
    return brushSize * (rect.width / canvas.width);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Failed to save edited image.");
        return;
      }
      
      if (result.url.startsWith("blob:")) {
        URL.revokeObjectURL(result.url);
      }
      
      const newUrl = URL.createObjectURL(blob);
      setResult({
        ...result,
        url: newUrl
      });
      setIsEditing(false);
      toast.success("Cutout edited successfully!");
    }, "image/png");
  };

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
    if (result?.url && result.url.startsWith("blob:")) {
      URL.revokeObjectURL(result.url);
    }
    setResult(null);
    setOriginalFile(null);
    setOriginalUrl(null);
    setUploaderKey(prev => prev + 1);
    setBgPreviewMode("transparent");
    setApplyShadow(false);
  };

  const handleUpload = async (files: File[]) => {
    let fileToUpload = files[0];
    
    setIsLoading(true);
    
    if (result?.url && result.url.startsWith("blob:")) {
      URL.revokeObjectURL(result.url);
    }
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
      triggerCelebration();
      toast.success("Background removed successfully!");
    } catch (error: any) {
      console.error("BG Removal error:", error);
      toast.error(error.message || "Failed to remove background. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBakeAndDownload = () => {
    if (!result) return;
    
    // Default transparent PNG download
    if (bgPreviewMode === "transparent" && !applyShadow) {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.filename;
      link.click();
      return;
    }
    
    // Render custom background & shadow on client canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = result.url;
    
    toast.info("Preparing optimized download...");
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Draw background
      if (bgPreviewMode === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgPreviewMode === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgPreviewMode === "blue") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#60a5fa");
        gradient.addColorStop(1, "#2563eb");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgPreviewMode === "sunset") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#fb923c");
        gradient.addColorStop(1, "#db2777");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgPreviewMode === "neon") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#34d399");
        gradient.addColorStop(1, "#059669");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Apply drop shadow parameters
      if (applyShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = Math.round(canvas.width * 0.04);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = Math.round(canvas.width * 0.025);
      }
      
      // Draw actual cutout foreground
      ctx.drawImage(img, 0, 0);
      
      // Download trigger
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      const baseName = result.filename.replace(/\.[^/.]+$/, "");
      link.download = `${baseName}_cutout.png`;
      link.click();
      triggerConfetti();
      toast.success("Download complete!");
    };
    
    img.onerror = () => {
      toast.error("Failed to generate download");
    };
  };

  const howToUse = [
    { step: "Upload Photo", description: "Select any image with a person, product, or clear subject." },
    { step: "AI Analysis", description: "Our neural network detects and isolates the foreground instantly." },
    { step: "Save PNG", description: "Download your professional-grade image with full transparency." },
  ];

  const faqs = [
    {
      question: "How do I remove background from image without losing quality?",
      answer: "Our neural network models operate directly at original image dimensions without forced compression. The AI calculates an alpha channel mask and returns full-resolution 4K/HD transparent PNG files."
    },
    {
      question: "Is this background remover 100% free with no watermarks?",
      answer: "Yes. Unlike other tools that charge subscription credits or insert watermarks, The Utilify provides 100% free, unlimited, full-resolution background removal with zero watermarks and no mandatory sign-up."
    },
    {
      question: "Can I make a pure white background for Amazon or Shopify products?",
      answer: "Yes! After the AI strips the background, use the built-in background color selector to choose pure white (#FFFFFF), black, or custom brand HEX colors with one click."
    },
    {
      question: "How can I remove the background from a handwritten signature or logo?",
      answer: "Upload your scanned signature or logo file. The AI recognizes solid line art and isolates the ink strokes onto a crystal-clear transparent background, perfect for embedding into PDF contracts and documents."
    },
    {
      question: "What is the output format?",
      answer: "We output transparent PNG files with a full 32-bit alpha channel. This ensures you can seamlessly layer your cutout onto any custom background, presentation, or graphic design."
    },
    {
      question: "Are my private photos and documents safe?",
      answer: "Yes. All processing occurs transiently in RAM streams without persistent disk storage. Images are immediately released from memory upon response delivery, ensuring 100% privacy."
    },
    {
      question: "How does the built-in eraser and repair brush work?",
      answer: "If overlapping background items remain, click 'Edit Cutout' to open the interactive canvas brush. You can manually erase unwanted remnants or restore details with adjustable brush sizing."
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
      title={customTitle || "Background Remover"}
      description={customDescription || "Remove image backgrounds automatically in seconds. Powered by professional-grade AI for pixel-perfect results."}
      summaryDefinition="An AI background remover isolates foreground subjects (portraits, products, signatures, and graphics) and removes unwanted backdrops. It generates full-resolution transparent PNG cutouts without watermarks, subscription paywalls, or credit limits."
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
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
                AI Segmentation Model
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "isnet-general-use" as const,
                    name: "Ultra Detail (High Fidelity)",
                    desc: "Recommended. Best overall quality. Excels at complex details, hair, and transparent gaps/holes.",
                    badge: "Best Quality",
                    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  },
                  {
                    id: "u2net" as const,
                    name: "Balanced (General)",
                    desc: "Good balance of speed and detail. Best for standard products and isolated objects.",
                    badge: "Standard",
                    badgeColor: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                  },
                  {
                    id: "u2net_human_seg" as const,
                    name: "Portraits (Human)",
                    desc: "Optimized specifically for human silhouette detection.",
                    badge: "People",
                    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  },
                  {
                    id: "u2net_cloth_seg" as const,
                    name: "Clothing / Apparel",
                    desc: "Specifically tuned for apparel, fashion retail, and clothing layers.",
                    badge: "E-Commerce",
                    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                  },
                  {
                    id: "silueta" as const,
                    name: "Eco / Fast",
                    desc: "Extremely lightweight model. Fast processing on lower resolution images.",
                    badge: "Fastest",
                    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setModelMode(item.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all duration-300 flex flex-col gap-1 hover:shadow-sm active:scale-[0.99]",
                      modelMode === item.id
                        ? "border-primary bg-primary/[0.03] text-foreground"
                        : "border-zinc-200 dark:border-zinc-800 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn(
                        "font-extrabold text-xs transition-colors duration-300",
                        modelMode === item.id ? "text-primary" : "text-foreground"
                      )}>
                        {item.name}
                      </span>
                      <span className={cn("text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border", item.badgeColor)}>
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 leading-relaxed font-medium">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Edge Refinement Toggle */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-0.5">
                    Smooth Mask Contours
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Post-process mask borders (best for portraits; keep off for text & graphics)
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
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                {originalUrl ? (
                  <img
                    src={originalUrl}
                    alt="Original Thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6" />
                )}
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
        <div ref={resultsRef} className="lg:col-span-7 scroll-mt-24">
          {isLoading ? (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6 w-32 h-32 rounded-3xl border border-primary/20 overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 shadow-md">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Processing Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 filter blur-[1px]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent animate-pulse" />
                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Removing Background...</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                Our AI neural network is isolating the subject from your image. This usually takes 4-10 seconds depending on size (first request may take slightly longer as the model initializes).
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* View Mode Switcher */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Preview Mode
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode("slider")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      viewMode === "slider" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Interactive Slider
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("side-by-side")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      viewMode === "side-by-side" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Side by Side
                  </button>
                </div>
              </div>

              {viewMode === "slider" && originalUrl ? (
                <BeforeAfterSlider
                  beforeImage={originalUrl}
                  afterImage={result.url}
                  beforeLabel="Original Image"
                  afterLabel="Cutout (AI)"
                  alt={originalFile?.name || "Removed Background"}
                />
              ) : (
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
                    {/* Transparency Grid Pattern or custom background color */}
                    <div
                      className={cn(
                        "absolute inset-4 rounded-[1.5rem] transition-all duration-300",
                        bgPreviewMode === "transparent" ? "opacity-40 dark:opacity-10" : "opacity-100"
                      )}
                      style={{
                        ...(bgPreviewMode === "transparent"
                          ? {
                              backgroundImage: 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                              backgroundSize: '20px 20px',
                              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }
                          : bgPreviewMode === "white"
                          ? { backgroundColor: "#ffffff" }
                          : bgPreviewMode === "black"
                          ? { backgroundColor: "#000000" }
                          : bgPreviewMode === "blue"
                          ? { backgroundImage: "linear-gradient(135deg, #60a5fa, #2563eb)" }
                          : bgPreviewMode === "sunset"
                          ? { backgroundImage: "linear-gradient(135deg, #fb923c, #db2777)" }
                          : { backgroundImage: "linear-gradient(135deg, #34d399, #059669)" })
                      }}
                    />
                    <div className="relative z-10 p-4 min-h-[350px] flex items-center justify-center">
                      <img
                        src={result.url}
                        alt="Removed Background"
                        className={cn(
                          "max-w-full max-h-[350px] object-contain transition-all duration-300",
                          applyShadow ? "drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]" : "drop-shadow-2xl"
                        )}
                      />
                    </div>
                  </Card>
                </div>
              )}

              <Card className="p-10 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-green-500 mb-4">
                    <Zap className="h-4 w-4" /> AI Transformation Ready
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">Pixel-perfect transparency.</h2>

                  {/* Backdrop Quick Editor panel */}
                  <div className="space-y-4 mb-8 pb-8 border-b border-zinc-800 animate-in fade-in duration-300">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block">
                      Quick Backdrop Presets
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("transparent")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all relative overflow-hidden active:scale-95",
                          bgPreviewMode === "transparent" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        title="Transparent Grid"
                      >
                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-[9px] text-zinc-400 font-black">Grid</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("white")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 bg-white transition-all active:scale-95",
                          bgPreviewMode === "white" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        title="White backdrop"
                      />
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("black")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 bg-black transition-all active:scale-95",
                          bgPreviewMode === "black" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        title="Black backdrop"
                      />
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("blue")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all active:scale-95",
                          bgPreviewMode === "blue" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #2563eb)" }}
                        title="Blue Gradient"
                      />
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("sunset")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all active:scale-95",
                          bgPreviewMode === "sunset" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #db2777)" }}
                        title="Sunset Gradient"
                      />
                      <button
                        type="button"
                        onClick={() => setBgPreviewMode("neon")}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all active:scale-95",
                          bgPreviewMode === "neon" ? "border-primary scale-110" : "border-zinc-700"
                        )}
                        style={{ backgroundImage: "linear-gradient(135deg, #34d399, #059669)" }}
                        title="Neon Gradient"
                      />

                      <button
                        type="button"
                        onClick={() => setApplyShadow(!applyShadow)}
                        className={cn(
                          "ml-auto px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95",
                          applyShadow ? "bg-primary border-primary text-primary-foreground" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        )}
                      >
                        Soft Shadow
                      </button>
                    </div>
                  </div>

                  {/* Leftover background helper tip */}
                  <div className="mb-8 p-5 rounded-[1.5rem] bg-zinc-900 border border-zinc-800/80 flex items-start gap-4 animate-in fade-in duration-500">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-left space-y-1">
                      <p className="text-xs font-black text-zinc-200">Leftover background elements?</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        If objects directly behind you (like the hanging t-shirt) overlap with your silhouette, AI models interpret them as part of the foreground. You can easily remove them in seconds by clicking the <strong className="text-primary font-black">Edit Cutout</strong> tool below and brushing over them.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
                    <Button 
                      onClick={handleBakeAndDownload} 
                      className="flex-1 h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="mr-2 h-6 w-6" /> Download Result
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="h-16 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold transition-all border border-zinc-700 flex items-center justify-center gap-2"
                    >
                      <Eraser className="h-5 w-5 text-primary animate-pulse" /> Edit Cutout
                    </Button>
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

      {isEditing && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-zinc-900/50">
            <div>
              <h3 className="text-xl font-black text-zinc-100 m-0">Manual Eraser Editor</h3>
              <p className="text-xs text-zinc-400">Drag to erase remaining background elements</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                <label className="text-xs font-black uppercase text-zinc-400">Brush Size</label>
                <input
                  type="range"
                  min="5"
                  max="250"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-32 accent-primary"
                />
                <span className="text-xs text-zinc-300 font-bold w-6">{brushSize}px</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="h-10 px-6 border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="h-10 px-6 rounded-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Editor Workspace */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative select-none">
            {/* Transparency Grid Backdrop */}
            <div
              className="absolute inset-8 rounded-2xl opacity-40 dark:opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            
            <div className="relative max-w-full max-h-[70vh] flex items-center justify-center bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/50 shadow-2xl cursor-none">
              {isEditorImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 rounded-2xl z-10">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                  <p className="text-sm text-zinc-400">Loading image...</p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={() => { stopDrawing(); setBrushPos(null); }}
                onTouchStart={startDrawing}
                onTouchMove={handleDrawing}
                onTouchEnd={stopDrawing}
                className="max-w-full max-h-[65vh] w-auto h-auto cursor-none rounded-lg block mx-auto"
                style={{ touchAction: "none" }}
              />
              
              {/* Brush Preview Circle */}
              {brushPos && !isEditorImageLoading && (
                <div
                  className="absolute border-2 border-white rounded-full pointer-events-none bg-primary/10 shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 z-[100]"
                  style={{
                    left: brushPos.x,
                    top: brushPos.y,
                    width: getVisualBrushRadius() * 2,
                    height: getVisualBrushRadius() * 2,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
