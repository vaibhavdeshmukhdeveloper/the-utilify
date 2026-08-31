"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { 
  Image as ImageIcon, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Minimize2, 
  Zap, 
  Settings, 
  Archive, 
  Layers,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { triggerConfetti, triggerCelebration } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface CompressedItem {
  id: string;
  name: string;
  originalSize: number;
  originalSizeFormatted: string;
  originalUrl: string;
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  compressedSizeFormatted?: string;
  savingsPercent?: number;
  filename: string;
  status: "idle" | "compressing" | "done" | "error";
  errorMsg?: string;
}

export default function ImageCompressorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState<"original" | "png" | "jpeg" | "webp">("original");
  const [isZipping, setIsZipping] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const selectedItem = items.find((it) => it.id === selectedItemId) || items[0];

  useEffect(() => {
    if (items.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [items.length]);

  const compressSingleFile = async (file: File, qValue: number, fmt: string): Promise<{ blob: Blob; filename: string }> => {
    return new Promise<{ blob: Blob; filename: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not create canvas context"));
            return;
          }

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          const q = qValue / 100;
          let mimeType = file.type || "image/jpeg";

          if (fmt === "png") mimeType = "image/png";
          else if (fmt === "jpeg") mimeType = "image/jpeg";
          else if (fmt === "webp") mimeType = "image/webp";
          else mimeType = file.type || "image/jpeg";

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Determine output extension
                let extension = "jpg";
                if (blob.type === "image/png") extension = "png";
                else if (blob.type === "image/webp") extension = "webp";
                else if (blob.type === "image/jpeg") extension = "jpg";

                const baseName = file.name.replace(/\.[^/.]+$/, "");
                const outputFilename = `compressed_${baseName}.${extension}`;

                if (blob.size > file.size && mimeType === file.type) {
                  resolve({ blob: file, filename: outputFilename });
                } else {
                  resolve({ blob, filename: outputFilename });
                }
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            mimeType,
            q
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    // Filter files > 25MB
    const validFiles: File[] = [];
    for (const f of files) {
      if (f.size > 25 * 1024 * 1024) {
        toast.error(`${f.name} is too large (>25MB)! Skipped.`);
      } else {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) return;

    setIsLoading(true);

    const newItems: CompressedItem[] = validFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      originalSize: file.size,
      originalSizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      originalUrl: URL.createObjectURL(file),
      filename: `compressed_${file.name}`,
      status: "compressing",
    }));

    setItems(newItems);
    setSelectedItemId(newItems[0].id);

    const processedItems: CompressedItem[] = [];

    for (const item of newItems) {
      const originalFile = validFiles.find((f) => f.name === item.name);
      if (!originalFile) continue;

      try {
        const { blob, filename } = await compressSingleFile(originalFile, quality[0], format);
        const compressedSize = blob.size;
        const compressedSizeFormatted = (compressedSize / (1024 * 1024)).toFixed(2) + " MB";
        const compressedUrl = URL.createObjectURL(blob);
        const savingsPercent = Math.max(0, Math.round(((item.originalSize - compressedSize) / item.originalSize) * 100));

        processedItems.push({
          ...item,
          compressedBlob: blob,
          compressedUrl,
          compressedSize,
          compressedSizeFormatted,
          savingsPercent,
          filename,
          status: "done",
        });
      } catch (err: any) {
        processedItems.push({
          ...item,
          status: "error",
          errorMsg: err.message || "Failed to compress",
        });
      }
    }

    setItems(processedItems);
    setIsLoading(false);
    triggerCelebration();
    toast.success(`Successfully compressed ${processedItems.filter((i) => i.status === "done").length} images!`);
  };

  const handleDownloadAllZip = async () => {
    const doneItems = items.filter((it) => it.status === "done" && it.compressedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default || JSZipModule;
      const zip = new JSZip();
      doneItems.forEach((item) => {
        if (item.compressedBlob) {
          zip.file(item.filename, item.compressedBlob);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `utilify_compressed_images_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerCelebration();
      toast.success("ZIP archive downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ZIP archive");
    } finally {
      setIsZipping(false);
    }
  };

  const handleClear = () => {
    items.forEach((it) => {
      if (it.originalUrl) URL.revokeObjectURL(it.originalUrl);
      if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
    });
    setItems([]);
    setSelectedItemId(null);
  };

  const totalOriginalSize = items.reduce((acc, it) => acc + it.originalSize, 0);
  const totalCompressedSize = items.reduce((acc, it) => acc + (it.compressedSize || it.originalSize), 0);
  const overallSavingsPercent = totalOriginalSize > 0 ? Math.max(0, Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)) : 0;

  const howToUse = [
    { step: "Upload Images", description: "Select single or multiple JPG, PNG, or WebP images up to 25MB." },
    { step: "Adjust Quality", description: "Use the slider to customize compression strength and choose output format." },
    { step: "Download or Export ZIP", description: "Download individual photos or export all compressed images as a single ZIP archive." },
  ];

  const faqs = [
    {
      question: "How do I compress an image to under 20KB, 50KB, or 100KB?",
      answer: "Adjust the quality slider to 50–70% or choose the WebP output format. WebP offers 30% higher compression efficiency than JPEG, allowing high-resolution photos to shrink down to under 50KB without noticeable artifacting."
    },
    {
      question: "Will I lose image quality during compression?",
      answer: "At the recommended 80% quality level, file size is reduced by up to 80% with perceptually lossless visual clarity, maintaining crisp text and sharp photographic edges."
    },
    {
      question: "Can I batch compress multiple PNG and JPEG images simultaneously?",
      answer: "Yes! You can upload and batch compress up to 20 images at once in parallel. When complete, download individual files or click 'Download All as ZIP' for a unified archive."
    },
    {
      question: "How does image compression improve Core Web Vitals and Google SEO?",
      answer: "Heavy hero images are the primary cause of poor Largest Contentful Paint (LCP) scores. Compressing images under 100KB dramatically speeds up mobile page load times and boosts Google ranking factors."
    },
    {
      question: "Which formats are supported?",
      answer: "We support JPEG, PNG, and modern WebP. You can also cross-convert formats (e.g. transparent PNG to compressed WebP) with zero server delay."
    },
    {
      question: "Are my photos uploaded to any external server?",
      answer: "Never. All compression runs 100% locally on your computer/phone using the HTML5 Canvas API and WebAssembly. Your photos never leave your device."
    }
  ];

  const relatedTools = [
    { name: "Background Remover", href: "/background-remover" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Split PDF", href: "/split-pdf" },
    { name: "Color Palette", href: "/color-palette" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Squeezing Web Graphics for Speed & SEO</h3>
      <p>
        Uncompressed images are the single largest bottleneck for website load times and Core Web Vitals (Largest Contentful Paint). Compressing images reduces bandwidth consumption, speeds up mobile page rendering, and improves Google search rankings.
      </p>
      <h4>Understanding Image Compression Formats</h4>
      <ul>
        <li><strong>JPEG Compression:</strong> Eliminates high-frequency noise imperceptible to the human eye. Best for camera photos and detailed graphics.</li>
        <li><strong>PNG Compression:</strong> Optimizes color tables and indexed palettes while preserving crisp text outlines and transparency.</li>
        <li><strong>WebP Compression:</strong> Modern web standard developed by Google, delivering 25–35% smaller file sizes than comparable JPEGs.</li>
      </ul>
      <h4>Batch Processing & Privacy</h4>
      <p>
        The Utilify's Image Compressor executes entirely client-side using browser Canvas API and WebAssembly algorithms. Sensitive business graphics and personal photos are processed securely with zero server storage.
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress PNG, JPEG, and WebP images in batch with zero quality loss. 100% client-side privacy with 1-click ZIP export."
      summaryDefinition="An image compressor reduces the file size of WebP, JPEG, and PNG images through lossy and lossless algorithms without visible quality degradation. It runs 100% locally in the browser with zero server uploads and batch ZIP export."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
        {/* Left Column: Settings & Upload */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 bg-card border rounded-3xl space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <Settings className="w-4 h-4 text-primary" />
                  Quality: {quality[0]}%
                </label>
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {quality[0] < 50 ? "High Compression" : quality[0] < 80 ? "Balanced" : "High Quality"}
                </span>
              </div>
              <Slider
                value={quality}
                onValueChange={(val) => setQuality(Array.isArray(val) ? val : [val])}
                max={100}
                min={10}
                step={1}
                className="py-3"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                <ImageIcon className="w-4 h-4 text-primary" />
                Output Format
              </label>
              <Tabs value={format} onValueChange={(val) => setFormat(val as any)} className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-10 rounded-xl">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="png">PNG</TabsTrigger>
                  <TabsTrigger value="jpeg">JPEG</TabsTrigger>
                  <TabsTrigger value="webp">WebP</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FileUploader
              label="Drop single or multiple images"
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              multiple={true}
              maxFiles={20}
              onUpload={handleUpload}
              isLoading={isLoading}
              hideDownload={true}
            />

            <div className="p-4 bg-muted/40 rounded-2xl border flex items-start gap-3 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Supports batch processing up to <strong>20 files (25MB each)</strong>. Processed entirely in RAM on your device.
              </p>
            </div>
          </Card>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-card/60 border rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Minimize2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Size Reduction</p>
                <p className="text-sm font-bold text-foreground">Up to 85%</p>
              </div>
            </Card>
            <Card className="p-4 bg-card/60 border rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Batch Queue</p>
                <p className="text-sm font-bold text-foreground">ZIP Export</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Interactive Results & Batch Queue */}
        <div ref={resultsRef} className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <Card className="h-[460px] flex flex-col items-center justify-center p-8 text-center border-primary/20 bg-primary/5 rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary animate-pulse">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-foreground">Compressing Images...</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Optimizing pixel payload and converting image buffers with local WebAssembly.
              </p>
            </Card>
          ) : items.length > 0 ? (
            <div className="space-y-6">
              {/* Batch Summary Bar */}
              <Card className="p-6 bg-card border rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-green-500 flex items-center gap-1.5 mb-1">
                    <Zap className="h-3.5 w-3.5" /> Batch Complete
                  </span>
                  <h3 className="text-xl font-black text-foreground">
                    {items.filter((i) => i.status === "done").length} Images Compressed
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Saved {((totalOriginalSize - totalCompressedSize) / (1024 * 1024)).toFixed(2)} MB total ({overallSavingsPercent}% reduction)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="rounded-xl text-xs gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear All
                  </Button>
                  <Button
                    onClick={handleDownloadAllZip}
                    disabled={isZipping}
                    size="sm"
                    className="rounded-xl font-bold text-xs gap-1.5 shadow-md"
                  >
                    {isZipping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
                    Download All (ZIP)
                  </Button>
                </div>
              </Card>

              {/* Interactive Before/After Drag Slider on Selected Image */}
              {selectedItem && selectedItem.compressedUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
                    <span>INTERACTIVE COMPARISON: {selectedItem.name}</span>
                    <span className="text-green-500 font-bold">-{selectedItem.savingsPercent}% Smaller</span>
                  </div>
                  <BeforeAfterSlider
                    beforeImage={selectedItem.originalUrl}
                    afterImage={selectedItem.compressedUrl}
                    beforeLabel={`Original (${selectedItem.originalSizeFormatted})`}
                    afterLabel={`Compressed (${selectedItem.compressedSizeFormatted})`}
                    alt={selectedItem.name}
                  />
                </div>
              )}

              {/* Batch Queue List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground px-1">
                  Queue Items ({items.length})
                </h4>
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer hover:border-primary/50",
                        selectedItemId === item.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.originalUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border shrink-0 bg-zinc-100 dark:bg-zinc-900"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.originalSizeFormatted}</span>
                            <span>→</span>
                            <span className="font-bold text-green-500">{item.compressedSizeFormatted || "..."}</span>
                            {item.savingsPercent !== undefined && (
                              <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-black text-[10px]">
                                -{item.savingsPercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.compressedUrl && (
                          <a
                            href={item.compressedUrl}
                            download={item.filename}
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerConfetti();
                            }}
                          >
                            <Button size="sm" variant="outline" className="rounded-xl h-9 px-3 text-xs font-bold gap-1.5">
                              <Download className="h-3.5 w-3.5" /> Download
                            </Button>
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Card className="h-[460px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed bg-card rounded-3xl">
              <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center mb-6">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-foreground">High-Speed Image Compression</h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                Upload one or multiple photos to instantly shrink file sizes while retaining crystal-clear quality.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                <ArrowRight className="h-3.5 w-3.5" /> Upload images to begin
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
