"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Trash2, Clipboard, FileText, ArrowLeftRight, Upload, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/CopyButton";

export default function Base64Client() {
  const [activeTab, setActiveTab] = useState("encode");
  const [isDragOverPlain, setIsDragOverPlain] = useState(false);
  const [isDragOverBase64, setIsDragOverBase64] = useState(false);
  
  // Text encoding states
  const [plainInput, setPlainInput] = useState("Hello from Utilify!");
  const [base64Output, setBase64Output] = useState("");

  // Text decoding states
  const [base64Input, setBase64Input] = useState("SGVsbG8gZnJvbSBVdGlsaWZ5IQ==");
  const [plainOutput, setPlainOutput] = useState("");

  // File states
  const [fileBase64, setFileBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Save to recently used history in local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const href = "/base64";
      
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Error setting recently used tools", e);
    }
  }, []);

  const handleDragOverPlain = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverPlain(true);
  };

  const handleDragLeavePlain = () => {
    setIsDragOverPlain(false);
  };

  const handleDropPlain = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverPlain(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleEncode(text);
      toast.success(`Loaded dropped file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDragOverBase64 = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBase64(true);
  };

  const handleDragLeaveBase64 = () => {
    setIsDragOverBase64(false);
  };

  const handleDropBase64 = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverBase64(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleDecode(text);
      toast.success(`Loaded dropped file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (fileBase64 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [fileBase64]);

  const handleEncode = (text: string) => {
    setPlainInput(text);
    try {
      // Use standard btoa with utf-8 encoding support
      const utf8Bytes = new TextEncoder().encode(text);
      let binary = "";
      const len = utf8Bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      setBase64Output(window.btoa(binary));
    } catch {
      setBase64Output("Error encoding text.");
    }
  };

  const handleDecode = (b64: string) => {
    setBase64Input(b64);
    if (!b64.trim()) {
      setPlainOutput("");
      return;
    }
    try {
      const binary = window.atob(b64.trim());
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      setPlainOutput(new TextDecoder().decode(bytes));
    } catch {
      setPlainOutput("Invalid Base64 string format.");
    }
  };

  // Run initial conversions
  useState(() => {
    handleEncode(plainInput);
    handleDecode(base64Input);
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract the raw base64 string from data URL
      const base64Data = result.split(",")[1] || "";
      setFileBase64(base64Data);
      toast.success("File converted to Base64");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };



  const clearFile = () => {
    setFileBase64("");
    setFileName("");
    setFileSize(0);
    setFileType("");
    toast.success("File cleared");
  };

  const howToUse = [
    { step: "Choose Action", description: "Select between 'Encode Text', 'Decode Text', or 'File to Base64' based on your requirements." },
    { step: "Input Contents", description: "Type plain text, paste a base64 string, or drag and drop a file up to 5MB." },
    { step: "Copy Output", description: "Review the validated, converted Base64 output and copy it securely." },
  ];

  const faqs = [
    {
      question: "What is Base64 encoding used for?",
      answer: "Base64 encoding schemes are used to represent binary data in an ASCII string format. It is widely used to embed images directly in HTML/CSS (via data URIs), send file attachments in emails, and transmit binary payloads over APIs."
    },
    {
      question: "Are my files or text sent to a server?",
      answer: "No. Everything runs strictly in your web browser using HTML5 FileReader and JavaScript text decoders. Your data remains fully private and never leaves your computer."
    },
    {
      question: "What is the maximum file size for conversions?",
      answer: "We set a local check to restrict file inputs to 5MB. This ensures processing remains lightning fast without freezing your browser memory."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "QR Code Generator", href: "/qr-generator" },
    { name: "Text Case Converter", href: "/text-converter" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Base64 Binary Encoding</h3>
      <p>
        Base64 is a binary-to-text encoding method that translates arbitrary data (including binaries, archives, and images) into a string sequence of 64 printable ASCII characters: <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, and <code>/</code>, with <code>=</code> representing padding bytes.
      </p>
      <h4>How Base64 Works:</h4>
      <p>
        The encoder takes 3 bytes of binary data (24 bits) and breaks them into 4 groups of 6 bits each. Each 6-bit value maps to one of the 64 characters in the index list. Because 3 bytes are encoded into 4 characters, Base64 increases data file sizes by approximately 33%.
      </p>
      <h4>Applications in Web Development:</h4>
      <ul>
        <li><strong>Inline Data URIs:</strong> Speed up load times for small icons by embedding them directly: <code>&lt;img src="data:image/png;base64,iVBORw..." /&gt;</code>.</li>
        <li><strong>API Integration:</strong> Send structured JSON requests containing files or keys without causing encoding breaks from special control characters.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text or files into Base64 format and decode Base64 strings back to their original form securely in-browser."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-left">
        <Tabs defaultValue="encode" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900">
            <TabsTrigger value="encode" className="text-sm font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Encode Text</TabsTrigger>
            <TabsTrigger value="decode" className="text-sm font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Decode Text</TabsTrigger>
            <TabsTrigger value="file" className="text-sm font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">File to Base64</TabsTrigger>
          </TabsList>

          {/* Encode Text Tab */}
          <TabsContent value="encode" className="mt-8 space-y-6 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Plain Text (Input)</label>
                <div 
                  onDragOver={handleDragOverPlain}
                  onDragLeave={handleDragLeavePlain}
                  onDrop={handleDropPlain}
                  className={cn(
                    "relative rounded-2xl transition-all duration-200",
                    isDragOverPlain ? "ring-2 ring-primary/50" : ""
                  )}
                >
                  {isDragOverPlain && (
                    <div className="absolute inset-0 z-30 bg-background/90 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-primary rounded-2xl animate-in fade-in duration-200">
                      <Upload className="w-8 h-8 text-primary animate-bounce mb-1" />
                      <p className="text-xs font-black uppercase tracking-wider text-primary">Drop Text File</p>
                    </div>
                  )}
                  <Textarea
                    value={plainInput}
                    onChange={(e) => handleEncode(e.target.value)}
                    placeholder="Type plain text..."
                    className="min-h-[220px] rounded-2xl border-2 focus:border-primary p-4 leading-relaxed font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Base64 String (Output)</label>
                  <CopyButton
                    value={base64Output}
                    label="Copy"
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-primary hover:bg-primary/5"
                    disabled={!base64Output}
                    title="Copy Base64 Output"
                  />
                </div>
                <Textarea
                  readOnly
                  value={base64Output}
                  placeholder="Encoded output will appear here..."
                  className="min-h-[220px] rounded-2xl border-2 p-4 leading-relaxed font-mono font-bold bg-zinc-50 dark:bg-zinc-900"
                />
              </div>
            </div>
          </TabsContent>

          {/* Decode Text Tab */}
          <TabsContent value="decode" className="mt-8 space-y-6 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Base64 String (Input)</label>
                <div 
                  onDragOver={handleDragOverBase64}
                  onDragLeave={handleDragLeaveBase64}
                  onDrop={handleDropBase64}
                  className={cn(
                    "relative rounded-2xl transition-all duration-200",
                    isDragOverBase64 ? "ring-2 ring-primary/50" : ""
                  )}
                >
                  {isDragOverBase64 && (
                    <div className="absolute inset-0 z-30 bg-background/90 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-primary rounded-2xl animate-in fade-in duration-200">
                      <Upload className="w-8 h-8 text-primary animate-bounce mb-1" />
                      <p className="text-xs font-black uppercase tracking-wider text-primary">Drop Base64 Text File</p>
                    </div>
                  )}
                  <Textarea
                    value={base64Input}
                    onChange={(e) => handleDecode(e.target.value)}
                    placeholder="Paste Base64 string here..."
                    className="min-h-[220px] rounded-2xl border-2 focus:border-primary p-4 leading-relaxed font-mono font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Plain Text (Output)</label>
                  <CopyButton
                    value={plainOutput}
                    label="Copy"
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-primary hover:bg-primary/5"
                    disabled={!plainOutput}
                    title="Copy Plain Text Output"
                  />
                </div>
                <Textarea
                  readOnly
                  value={plainOutput}
                  placeholder="Decoded text will appear here..."
                  className="min-h-[220px] rounded-2xl border-2 p-4 leading-relaxed font-semibold bg-zinc-50 dark:bg-zinc-900"
                />
              </div>
            </div>
          </TabsContent>

          {/* File to Base64 Tab */}
          <TabsContent value="file" className="mt-8 space-y-6 m-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-6">
                <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors bg-zinc-50 dark:bg-zinc-900/40">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-bold">Drag and drop file here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse local files (max 5MB)</p>
                </div>

                {fileName && (
                  <Card className="p-6 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h4 className="font-bold text-sm truncate max-w-[200px]">{fileName}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{fileType || "unknown type"}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearFile} className="text-red-500 hover:bg-red-500/5">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>File Size:</span>
                      <span className="font-mono">{(fileSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </Card>
                )}
              </div>

              <div ref={resultsRef} className="md:col-span-7 space-y-3 scroll-mt-24">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><ArrowLeftRight className="h-4 w-4 text-primary" /> Generated Base64 Data URI</label>
                  {fileBase64 && (
                    <CopyButton
                      value={fileBase64 ? `data:${fileType};base64,${fileBase64}` : ""}
                      label="Copy Data URI"
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-primary hover:bg-primary/5"
                      title="Copy Base64 Data URI"
                    />
                  )}
                </div>
                <Textarea
                  readOnly
                  value={fileBase64 ? `data:${fileType};base64,${fileBase64}` : ""}
                  placeholder="Base64 Data URI representing the uploaded file will generate here..."
                  className="min-h-[220px] rounded-2xl border-2 p-4 leading-relaxed font-mono text-xs bg-zinc-50 dark:bg-zinc-900"
                />
                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-2">
                  <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-muted-foreground leading-normal">
                    You can copy either the full HTML/CSS ready **Data URI** or just the raw base64 data. Useful for inline source files.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
