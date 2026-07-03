"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Clipboard, Type, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export default function TextConverterClient() {
  const [text, setText] = useState("Type or paste your text here to convert it...");

  // Calculations
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text.split("\n").filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;


  const pasteFromClipboard = async () => {
    try {
      const clipped = await navigator.clipboard.readText();
      setText(clipped);
      toast.success("Text pasted from clipboard");
    } catch {
      toast.error("Failed to paste text (Check browser permissions)");
    }
  };

  const clearText = () => {
    setText("");
    toast.success("Text cleared");
  };

  // Conversion algorithms
  const toUppercase = () => {
    setText(text.toUpperCase());
    toast.success("Converted to UPPERCASE");
  };

  const toLowercase = () => {
    setText(text.toLowerCase());
    toast.success("Converted to lowercase");
  };

  const toSentenceCase = () => {
    const sentenceArr = text.toLowerCase().split(/([.!?]\s*)/);
    let cap = true;
    const res = sentenceArr.map((part) => {
      if (part.match(/[.!?]/)) {
        cap = true;
        return part;
      }
      if (cap && part.trim().length > 0) {
        cap = false;
        // capitalize first letter
        const trimmed = part.trimStart();
        const nonTrimmedLen = part.length - trimmed.length;
        const leadingSpaces = part.substring(0, nonTrimmedLen);
        return leadingSpaces + trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      return part;
    });
    setText(res.join(""));
    toast.success("Converted to Sentence case");
  };

  const toTitleCase = () => {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs|via)$/i;
    const words = text.toLowerCase().split(/(\s+)/);
    const capWords = words.map((word, index) => {
      if (word.trim().length === 0) return word;
      if (index > 0 && word.match(smallWords)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    setText(capWords.join(""));
    toast.success("Converted to Title Case");
  };

  const toCapitalizedCase = () => {
    const words = text.toLowerCase().split(/(\s+)/);
    const capWords = words.map((word) => {
      if (word.trim().length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    setText(capWords.join(""));
    toast.success("Converted to Capitalized Case");
  };

  const toCamelCase = () => {
    const words = text.replace(/[^a-zA-Z0-9\s-_]/g, "").split(/[\s-_]+/);
    if (words.length === 0) return;
    const res = words
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
    setText(res);
    toast.success("Converted to camelCase");
  };

  const toSnakeCase = () => {
    const res = text
      .trim()
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/[\s-_]+/g, "_")
      .toLowerCase();
    setText(res);
    toast.success("Converted to snake_case");
  };

  const toKebabCase = () => {
    const res = text
      .trim()
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/[\s-_]+/g, "-")
      .toLowerCase();
    setText(res);
    toast.success("Converted to kebab-case");
  };

  const toInverseCase = () => {
    let res = "";
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (char === char.toUpperCase()) {
        res += char.toLowerCase();
      } else {
        res += char.toUpperCase();
      }
    }
    setText(res);
    toast.success("Converted to iNVERSE cASE");
  };

  const howToUse = [
    { step: "Type or Paste Text", description: "Write directly into the main editor window, or paste text from your system clipboard." },
    { step: "Choose Conversion Case", description: "Click any conversion action below (Title Case, UPPERCASE, snake_case, etc.) to instantly change the format." },
    { step: "Analyze Stats & Copy", description: "Monitor word metrics in real-time, and copy your converted text with one click." },
  ];

  const faqs = [
    {
      question: "Are word counts calculated accurately?",
      answer: "Yes. The counts adjust dynamically as you type. Characters are calculated both with and without space increments to help satisfy exact sizing requirements for forms and documents."
    },
    {
      question: "What does Title Case do?",
      answer: "Title Case capitalizes the first letter of all principal words while leaving small conjunctions, prepositions, and articles (like 'and', 'the', 'of', 'to') in lowercase, matching standard editorial titles."
    },
    {
      question: "Are my text documents secure?",
      answer: "Absolutely. Everything is handled entirely client-side inside your browser engine. We never read, inspect, or store any text contents you paste into the app."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Diff Checker", href: "/diff-checker" },
    { name: "Lorem Ipsum Generator", href: "/lorem-ipsum" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Case Formats</h3>
      <p>
        Different formatting guidelines dictate text styles across journalism, academic publishing, and programming languages.
      </p>
      <h4>Standard Cases:</h4>
      <ul>
        <li><strong>Sentence Case:</strong> Capitalizes only the first letter of sentences, standard for typical paragraphs.</li>
        <li><strong>Title Case:</strong> Capitalizes major words, ideal for headers, books, and articles.</li>
        <li><strong>Capitalized Case:</strong> Capitalizes every single word, regardless of grammar rules.</li>
      </ul>
      <h4>Developer Configurations:</h4>
      <ul>
        <li><strong>camelCase:</strong> Concatenates words together capitalizing each subsequent word (e.g. <code>myVariableName</code>). Standard for JavaScript and Java.</li>
        <li><strong>snake_case:</strong> Connects words using underscores (e.g. <code>my_database_field</code>). Standard in Python and SQL databases.</li>
        <li><strong>kebab-case:</strong> Connects words using hyphens (e.g. <code>my-css-class-name</code>). Standard in URL slugs and CSS stylesheets.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text formatting in real-time and analyze word, character, and line statistics."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-left">
        {/* Editor Area */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Type className="h-4 w-4" /> Text Editor</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={pasteFromClipboard} className="text-xs font-bold text-muted-foreground hover:text-primary">
                <Clipboard className="h-3.5 w-3.5 mr-1" /> Paste
              </Button>
              <Button variant="ghost" size="sm" onClick={clearText} className="text-xs font-bold text-red-500 hover:bg-red-500/5">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <div className="relative scroll-mt-24">
            <Textarea
              className="min-h-[250px] text-lg font-medium p-6 rounded-3xl border-2 focus:border-primary bg-background shadow-inner leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <CopyButton
              value={text}
              className="absolute right-4 bottom-4 w-10 h-10 shadow-md"
              size="icon"
              title="Copy converted text"
            />
          </div>
        </div>

        {/* Real-time stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{charCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Characters</div>
          </Card>
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{charNoSpaces}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">No Spaces</div>
          </Card>
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{wordCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Words</div>
          </Card>
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{lineCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Lines</div>
          </Card>
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{sentenceCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Sentences</div>
          </Card>
          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-2xl font-black text-primary font-mono">{paragraphCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Paragraphs</div>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 border-b pb-3 text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-primary" /> Case Conversion Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={toTitleCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              Title Case
            </Button>
            <Button onClick={toSentenceCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              Sentence case
            </Button>
            <Button onClick={toUppercase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              UPPERCASE
            </Button>
            <Button onClick={toLowercase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              lowercase
            </Button>
            <Button onClick={toCapitalizedCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              Capitalize Words
            </Button>
            <Button onClick={toInverseCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              Inverse Case
            </Button>
            <Button onClick={toCamelCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              camelCase
            </Button>
            <Button onClick={toSnakeCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              snake_case
            </Button>
            <Button onClick={toKebabCase} className="rounded-xl px-5 font-bold shadow-sm" variant="outline">
              kebab-case
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
