"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Trash2, FileJson, Check } from "lucide-react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      toast.success("JSON Formatted Successfully");
    } catch (error) {
      toast.error("Invalid JSON. Please check your input.");
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      toast.success("JSON Minified Successfully");
    } catch (error) {
      toast.error("Invalid JSON. Please check your input.");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const howToUse = [
    { step: "Paste JSON", description: "Paste your raw or messy JSON code into the input area." },
    { step: "Click Format", description: "Click the 'Format JSON' button to pretty-print your code." },
    { step: "Copy Result", description: "Copy the formatted JSON to use it in your project." },
  ];

  const faqs = [
    { 
      question: "Is my JSON data safe?", 
      answer: "Yes. This tool runs entirely in your browser. Your JSON data is never sent to our servers." 
    },
    { 
      question: "Can I minify JSON too?", 
      answer: "Yes, you can use the 'Minify' button to remove all whitespace and make the JSON compact." 
    },
    { 
      question: "What happens if my JSON is invalid?", 
      answer: "The tool will show an error message. Make sure your JSON follows standard syntax (double quotes, commas, etc.)." 
    },
  ];

  const relatedTools = [
    { name: "Markdown to PDF", href: "/markdown-to-pdf" },
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "PDF to Image", href: "/pdf-to-image" },
  ];

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Pretty-print, validate, and minify your JSON data instantly. 100% private and secure."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold">Input JSON</label>
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs text-muted-foreground">
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
            <Textarea
              placeholder="Paste raw JSON here..."
              className="flex-grow font-mono text-sm resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold">Formatted Output</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!output}
                className="h-8 text-xs text-muted-foreground"
              >
                {copied ? <Check className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="flex-grow font-mono text-sm resize-none bg-zinc-50 dark:bg-zinc-900"
              value={output}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button onClick={formatJson} size="lg" className="px-8">
            <FileJson className="mr-2 h-4 w-4" />
            Format JSON
          </Button>
          <Button onClick={minifyJson} variant="outline" size="lg" className="px-8">
            Minify JSON
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
