"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, CheckCircle2, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  label: string;
  onUpload: (files: File[]) => Promise<void>;
  isLoading: boolean;
  downloadUrl?: string;
  downloadFilename?: string;
  autoUpload?: boolean;
  hideDownload?: boolean;
}

export function FileUploader({
  accept,
  multiple = false,
  maxFiles = 1,
  label,
  onUpload,
  isLoading,
  downloadUrl,
  downloadFilename,
  autoUpload = false,
  hideDownload = false,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (autoUpload) {
      onUpload(acceptedFiles);
      setFiles([]);
    } else {
      setFiles(acceptedFiles);
    }
  }, [autoUpload, onUpload]);

  // Support pasting image from clipboard (Ctrl + V)
  const acceptsImages = Object.keys(accept).some((key) => key.startsWith("image/"));

  useEffect(() => {
    if (!acceptsImages) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        toast.success("Pasted image from clipboard");
        if (autoUpload) {
          onUpload(pastedFiles);
        } else {
          setFiles(pastedFiles);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [acceptsImages, autoUpload, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select a file first");
      return;
    }
    await onUpload(files);
  };

  if (downloadUrl && !hideDownload) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-1">Processing Complete!</h3>
          <p className="text-muted-foreground">Your file is ready for download.</p>
        </div>
        <a href={downloadUrl} download={downloadFilename} className="w-full">
          <Button size="lg" className="w-full h-14 text-lg font-bold">
            <Download className="mr-2 h-5 w-5" /> Download Result
          </Button>
        </a>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Convert another file
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center",
          isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
          files.length > 0 && "border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Upload className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">{label}</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Drag & drop your files here, click to browse
          {acceptsImages && (
            <>
              , or paste with{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border font-mono text-xs text-foreground font-black">Ctrl + V</kbd>
            </>
          )}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            onClick={handleUpload} 
            disabled={isLoading} 
            className="w-full h-14 text-lg font-bold mt-4 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Processing"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
