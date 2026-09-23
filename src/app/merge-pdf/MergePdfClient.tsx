"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUploader } from "@/components/FileUploader";
import { uploadToBackend } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Layers, Download, CheckCircle2, ArrowRight, Loader2, Plus, X, ArrowUp, ArrowDown, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { getLanguageFromPathname } from "@/lib/i18n/translations";

interface QueuedFile {
  file: File;
  id: string;
}

export interface MergePdfClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function MergePdfClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: MergePdfClientProps = {}) {
  const pathname = usePathname();
  const currentLang = (lang as any) || getLanguageFromPathname(pathname);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);

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
      question: "Can I add files from different directories?", 
      answer: "Yes. You can select files from multiple locations on your computer. Simply click 'Add More PDFs' repeatedly to queue additional documents." 
    },
    { 
      question: "How do I rearrange the order of the queued PDFs?", 
      answer: "Each file card in the queue lists Up and Down arrow buttons. Click these buttons to swap positions and adjust the final consolidation sequence." 
    },
    { 
      question: "Is there a limit on file count or total file size?", 
      answer: "You can merge up to 20 PDF documents in a single operation. The cumulative size limit is approximately 100MB to ensure high performance." 
    },
    {
      question: "Do you keep copies of my financial or legal PDFs?",
      answer: "No. All merging operations are performed dynamically inside RAM on secure, ephemeral cloud nodes. Your source files and the merged result are permanently purged as soon as you close or reset the window."
    },
    {
      question: "Will the page sizes, orientations, or margins change after merging?",
      answer: "No. Our merge compiler preserves the exact dimension, rotation orientation, text layout, vector objects, hyperlinks, and image details of every page in the source files."
    },
    {
      question: "Can I merge PDF forms that have fillable fields?",
      answer: "Yes, but please note that some fillable form fields might be flattened during compile to prevent naming conflicts between different forms."
    }
  ];

  const relatedTools = [
    { name: "Split PDF", href: "/split-pdf" },
    { name: "PDF to Image", href: "/pdf-to-image" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Consolidating Business and Personal Documents</h3>
      <p>
        Combining several individual PDF files into a single master document is one of the most common administrative tasks in the workplace. Whether you are assembling a lease application dossier, compiling corporate invoices for accounting, or organizing receipts for tax declarations, a single unified PDF is easier to store, navigate, and email.
      </p>
      <h4>Why Use Utilify to Merge PDFs?</h4>
      <ul>
        <li><strong>Interactive Queue Management:</strong> Easily add more files, remove incorrect files from the list, and order the sequence of documents before running the compiler.</li>
        <li><strong>Confidentiality First:</strong> Traditional web converters store uploaded PDFs on persistent physical server disks for days. Utilify handles your files strictly in transient memory.</li>
        <li><strong>High-Speed PDF Assembly:</strong> Our backend engine combines files in milliseconds, outputting a perfectly compiled single PDF.</li>
      </ul>
      <h4>How to Order Your Merge Queue</h4>
      <p>
        Documents will be combined in the exact numerical order shown in the queue (from 1 to N). Use the Up and Down arrow icons on the side of each file card to fine-tune the final pagination order. Once the queue represents your desired output, click 'Merge All Files' to complete the assembly.
      </p>
    </article>
  );

  const text = {
    uploaderLabel: queuedFiles.length > 0
      ? (currentLang === "es" ? "Añadir más PDFs" : currentLang === "pt" ? "Adicionar mais PDFs" : "Add More PDFs")
      : (currentLang === "es" ? "Seleccionar PDFs para Unir" : currentLang === "pt" ? "Selecionar PDFs para Juntar" : "Select PDFs to Merge"),
    queueTitle: currentLang === "es" ? `Cola para Unir (${queuedFiles.length})` : currentLang === "pt" ? `Fila para Juntar (${queuedFiles.length})` : `Merge Queue (${queuedFiles.length})`,
    mergingTitle: currentLang === "es" ? "Uniendo Documentos..." : currentLang === "pt" ? "Juntando Documentos..." : "Merging Documents...",
    mergingDesc: currentLang === "es" ? `Combinando ${queuedFiles.length} archivos en tu nuevo PDF.` : currentLang === "pt" ? `Combinando ${queuedFiles.length} arquivos no seu novo PDF.` : `Combining ${queuedFiles.length} files into your new PDF.`,
    successBadge: currentLang === "es" ? "Unión Exitosa" : currentLang === "pt" ? "Sucesso" : "Merge Success",
    successTitle: currentLang === "es" ? "¡Tu PDF combinado está listo!" : currentLang === "pt" ? "Seu PDF combinado está pronto!" : "Your combined PDF is ready!",
    downloadBtn: currentLang === "es" ? "Descargar PDF Unido" : currentLang === "pt" ? "Baixar PDF Juntado" : "Download Merged PDF",
    clearBtn: currentLang === "es" ? "Limpiar Todo" : currentLang === "pt" ? "Limpar Tudo" : "Clear All",
    backBtn: currentLang === "es" ? "Volver a la Cola" : currentLang === "pt" ? "Voltar para a Fila" : "Back to Queue",
    readyBadge: currentLang === "es" ? "Listo para Unir" : currentLang === "pt" ? "Pronto para Juntar" : "Ready to Merge",
    readyTitle: currentLang === "es" ? `Combinar ${queuedFiles.length} Documentos` : currentLang === "pt" ? `Combinar ${queuedFiles.length} Documentos` : `Combine ${queuedFiles.length} Documents`,
    mergeBtn: currentLang === "es" ? "Unir Todos los Archivos" : currentLang === "pt" ? "Juntar Todos os Arquivos" : "Merge All Files",
    minFilesNotice: currentLang === "es" ? "Añade al menos un archivo más para unir." : currentLang === "pt" ? "Adicione pelo menos mais um arquivo para juntar." : "Add at least one more file to enable merging.",
    queueModeLabel: currentLang === "es" ? "Modo de Cola" : currentLang === "pt" ? "Modo de Fila" : "Queue Mode",
    queueModeVal: currentLang === "es" ? "Cargas Sucesivas" : currentLang === "pt" ? "Envios Adicionais" : "Additive Uploads",
    orderingLabel: currentLang === "es" ? "Orden" : currentLang === "pt" ? "Ordem" : "Ordering",
    orderingVal: currentLang === "es" ? "Personalizable" : currentLang === "pt" ? "Personalizável" : "Fully Customizable",
    emptyTitle: currentLang === "es" ? "Crea tu Cola de PDFs" : currentLang === "pt" ? "Monte sua Fila de PDFs" : "Build Your PDF Queue",
    emptyDesc: currentLang === "es" ? "Añade varios archivos PDF. Puedes reordenarlos o eliminarlos antes de unirlos en un solo documento." : currentLang === "pt" ? "Adicione múltiplos arquivos PDF. Você pode reordená-los ou removê-los antes de juntá-los em um único documento." : "Add multiple PDF files from any folder. You can reorder them or remove files before merging them into one.",
    emptyAction: currentLang === "es" ? "Selecciona archivos para comenzar" : currentLang === "pt" ? "Selecione arquivos para começar" : "Select files to get started",
  };

  return (
    <ToolLayout
      title={customTitle || "Merge PDF"}
      description={customDescription || "Combine multiple PDF documents into a single, professional file. Queue files, reorder them, and merge in seconds."}
      summaryDefinition="A PDF merger combines multiple individual PDF documents, scans, invoices, and receipts into a single sequential master PDF. It supports interactive drag-and-drop reordering and RAM-only processing with zero data retention."
      customSummaryDefinition={customSummaryDefinition}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start text-left">
        {/* Left Column: Queue Management */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-4 sm:p-5 border-2 border-dashed bg-card rounded-2xl">
            <FileUploader
              label={text.uploaderLabel}
              lang={currentLang}
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
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4">
               <div className="flex items-center justify-between px-1">
                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{text.queueTitle}</p>
                 <Layers className="h-4 w-4 text-muted-foreground" />
               </div>
               <div className="space-y-2 max-h-[380px] overflow-auto pr-1 pb-2">
                {queuedFiles.map((qFile, idx) => (
                  <Card key={qFile.id} className="p-3 rounded-xl border-2 flex items-center gap-3 bg-white dark:bg-zinc-950 shadow-xs relative group hover:border-primary/50 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-xs">{qFile.file.name}</p>
                      <p className="text-[11px] text-muted-foreground">{formatSize(qFile.file.size)}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg" 
                        disabled={idx === 0}
                        onClick={() => moveFile(idx, 'up')}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg" 
                        disabled={idx === queuedFiles.length - 1}
                        onClick={() => moveFile(idx, 'down')}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFile(qFile.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Results */}
        <div ref={resultsRef} className="lg:col-span-6 lg:sticky lg:top-4 scroll-mt-24 space-y-4">
          {isLoading ? (
            <Card className="h-[340px] flex flex-col items-center justify-center p-6 text-center border-2 border-primary/20 bg-primary/5 rounded-2xl">
              <div className="relative mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <Plus className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-1.5">{text.mergingTitle}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-xs">
                {text.mergingDesc}
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <Card className="p-6 sm:p-7 bg-zinc-950 text-zinc-50 border-none shadow-xl rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Download className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {text.successBadge}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">{text.successTitle}</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-zinc-800">
                    <a href={result.url} download={result.filename} className="flex-1">
                      <Button className="w-full h-12 text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                        <Download className="mr-2 h-4 w-4" /> {text.downloadBtn}
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      onClick={() => {setResult(null); setQueuedFiles([]);}} 
                      className="h-12 px-5 text-sm font-bold rounded-xl border-zinc-800 text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900"
                    >
                      {text.clearBtn}
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Button 
                variant="ghost" 
                onClick={() => setResult(null)} 
                className="w-full h-10 text-xs font-bold border-2 border-dashed rounded-xl"
              >
                {text.backBtn}
              </Button>
            </div>
          ) : queuedFiles.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
               <Card className="p-6 sm:p-7 bg-primary text-primary-foreground border-none shadow-xl rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
                  <Plus className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">{text.readyBadge}</p>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">{text.readyTitle}</h2>
                  
                  <Button 
                    onClick={processMerge} 
                    disabled={queuedFiles.length < 2}
                    className="w-full h-14 text-base font-black bg-white text-primary hover:bg-zinc-100 rounded-xl shadow-md transition-all"
                  >
                    <Layers className="mr-2 h-5 w-5" /> {text.mergeBtn}
                  </Button>
                  
                  {queuedFiles.length < 2 && (
                    <p className="text-xs font-medium text-center mt-3 opacity-90">
                      {text.minFilesNotice}
                    </p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-3.5 bg-card border-2 rounded-xl flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
                    <FilePlus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{text.queueModeLabel}</p>
                    <p className="text-xs font-bold">{text.queueModeVal}</p>
                  </div>
                </Card>
                <Card className="p-3.5 bg-card border-2 rounded-xl flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{text.orderingLabel}</p>
                    <p className="text-xs font-bold">{text.orderingVal}</p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-[340px] flex flex-col items-center justify-center p-6 text-center border-dashed border-2 bg-card rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-1.5">{text.emptyTitle}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-xs leading-relaxed">
                {text.emptyDesc}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                <ArrowRight className="h-3.5 w-3.5" /> {text.emptyAction}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
