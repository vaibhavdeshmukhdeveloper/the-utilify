"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Layers, Download, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Plus, X, ArrowUp, ArrowDown, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueuedFile {
  file: File;
  id: string;
}

export default function MergePdfClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);

  const handleFileSelect = (newFiles: File[]) => {
    const formatted = newFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substring(7)
    }));
    setQueuedFiles(prev => [...prev, ...formatted]);
    setResult(null);
  };

  const removeFile = (id: string) => {
    setQueuedFiles(prev => prev.filter(f => f.id !== id));
    setResult(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...queuedFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setQueuedFiles(newFiles);
      setResult(null);
    }
  };

  const processMerge = async () => {
    if (queuedFiles.length < 2) {
      toast.error("Please add at least two PDF files to merge");
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      const filesToUpload = queuedFiles.map(q => q.file);
      const data = await uploadToBackend("/pdf/merge", filesToUpload);
      setResult(data);
      toast.success("PDFs merged successfully!");
    } catch (error: any) {
      console.error("Merge error:", error);
      toast.error(error.message || "Failed to merge PDFs. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const howToUse = [
    { step: "Add Files", description: "Upload PDFs one by one or in bulk from any folder." },
    { step: "Reorder", description: "Use the arrows to arrange the files in your preferred sequence." },
    { step: "Merge", description: "Click the 'Merge All' button to create your unified document." },
  ];

  const faqs = [
    { 
      question: "Can I add files from different folders?", 
      answer: "Yes! You can add files as many times as you want. They will be added to the end of the list." 
    },
    { 
      question: "How do I change the order?", 
      answer: "Use the Up and Down arrows on each file card to move it within the sequence." 
    },
    { 
      question: "Is there a limit?", 
      answer: "You can merge up to 20 files at once. The total size limit is approximately 100MB." 
    },
  ];

  const relatedTools = [
    { name: "Split PDF", href: "/split-pdf" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF documents into a single, professional file. Queue files, reorder them, and merge in seconds."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Queue Management */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 border-2 border-dashed bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2rem]">
            <FileUploader
              label={queuedFiles.length > 0 ? "Add More PDFs" : "Select PDFs to Merge"}
              accept={{ "application/pdf": [".pdf"] }}
              multiple={true}
              maxFiles={20}
              autoUpload={true}
              onUpload={async (files) => { handleFileSelect(files); }}
              isLoading={isLoading}
              hideDownload={true}
            />
          </Card>
          
          {queuedFiles.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
               <div className="flex items-center justify-between px-2">
                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Merge Queue ({queuedFiles.length})</p>
                 <Layers className="h-4 w-4 text-muted-foreground" />
               </div>
               <div className="space-y-3 max-h-[500px] overflow-auto pr-2 pb-4">
                {queuedFiles.map((qFile, idx) => (
                  <Card key={qFile.id} className="p-4 rounded-2xl border-2 flex items-center gap-4 bg-white dark:bg-zinc-950 shadow-sm relative group hover:border-primary/50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{qFile.file.name}</p>
                      <p className="text-[11px] text-muted-foreground">{formatSize(qFile.file.size)}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg" 
                        disabled={idx === 0}
                        onClick={() => moveFile(idx, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg" 
                        disabled={idx === queuedFiles.length - 1}
                        onClick={() => moveFile(idx, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFile(qFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Results */}
        <div className="lg:col-span-6">
          {isLoading ? (
            <Card className="h-[400px] flex flex-col items-center justify-center p-12 text-center border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <Plus className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Merging Documents...</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                Combining {queuedFiles.length} files into your new PDF.
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
                    <CheckCircle2 className="h-4 w-4" /> Merge Success
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-8">Your combined PDF is ready!</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-16 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all">
                        <Download className="mr-2 h-6 w-6" /> Download Merged PDF
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      onClick={() => {setResult(null); setQueuedFiles([]);}} 
                      className="h-16 px-8 rounded-2xl border-zinc-800 text-zinc-400 hover:text-white"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Button 
                variant="ghost" 
                onClick={() => setResult(null)} 
                className="w-full h-12 text-sm font-bold border-2 border-dashed rounded-xl"
              >
                Back to Queue
              </Button>
            </div>
          ) : queuedFiles.length > 0 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               <Card className="p-10 bg-primary text-primary-foreground border-none shadow-xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Plus className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-4">Ready to Merge</p>
                  <h2 className="text-3xl font-black tracking-tight mb-8">Combine {queuedFiles.length} Documents</h2>
                  
                  <Button 
                    onClick={processMerge} 
                    disabled={queuedFiles.length < 2}
                    className="w-full h-20 text-xl font-black bg-white text-primary hover:bg-zinc-100 rounded-2xl shadow-lg transition-all"
                  >
                    <Layers className="mr-2 h-6 w-6" /> Merge All Files
                  </Button>
                  
                  {queuedFiles.length < 2 && (
                    <p className="text-xs font-medium text-center mt-4 opacity-80">
                      Add at least one more file to enable merging.
                    </p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600">
                    <FilePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Queue Mode</p>
                    <p className="font-bold">Additive Uploads</p>
                  </div>
                </Card>
                <Card className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-none rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ordering</p>
                    <p className="font-bold">Fully Customizable</p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-[500px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-zinc-50/50 rounded-[3rem]">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <Plus className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Build Your PDF Queue</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                Add multiple PDF files from any folder. You can reorder them or remove files before merging them into one.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Select files to get started
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
