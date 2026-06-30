"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { AlignLeft, Copy, Sliders, LayoutGrid, Check } from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
  "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
  "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
  "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumClient() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words" | "lists">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Helper to generate a random word
  const getWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  // Helper to generate a sentence
  const generateSentence = (startText?: string) => {
    const len = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
    const words: string[] = [];

    if (startText) {
      words.push(startText);
    } else {
      const firstWord = getWord();
      words.push(firstWord.charAt(0).toUpperCase() + firstWord.slice(1));
    }

    for (let i = words.length; i < len; i++) {
      words.push(getWord());
    }

    return words.join(" ") + ".";
  };

  // Helper to generate a paragraph
  const generateParagraph = (isFirst: boolean) => {
    const sentenceCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 sentences
    const sentences: string[] = [];

    for (let i = 0; i < sentenceCount; i++) {
      if (isFirst && i === 0 && startWithLorem) {
        sentences.push(generateSentence("Lorem ipsum dolor sit amet"));
      } else {
        sentences.push(generateSentence());
      }
    }

    return sentences.join(" ");
  };

  const generateLorem = useCallback(() => {
    let result = "";

    if (type === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const p = generateParagraph(i === 0);
        paragraphs.push(includeHtml ? `<p>${p}</p>` : p);
      }
      result = paragraphs.join(includeHtml ? "\n\n" : "\n\n");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(generateSentence("Lorem ipsum dolor sit amet"));
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(" ");
      if (includeHtml) {
        result = `<p>${result}</p>`;
      }
    } else if (type === "words") {
      const words: string[] = [];
      if (startWithLorem && count >= 5) {
        words.push("Lorem", "ipsum", "dolor", "sit", "amet");
      }
      while (words.length < count) {
        const w = getWord();
        if (words.length === 0) {
          words.push(w.charAt(0).toUpperCase() + w.slice(1));
        } else {
          words.push(w);
        }
      }
      result = words.slice(0, count).join(" ");
      if (includeHtml) {
        result = `<span>${result}</span>`;
      }
    } else if (type === "lists") {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        const phrase = generateSentence().slice(0, -1); // remove period
        items.push(includeHtml ? `  <li>${phrase}</li>` : `• ${phrase}`);
      }
      if (includeHtml) {
        result = `<ul>\n${items.join("\n")}\n</ul>`;
      } else {
        result = items.join("\n");
      }
    }

    setOutput(result);
    setCopied(false);
  }, [type, count, startWithLorem, includeHtml]);

  // Adjust count bounds depending on generation type
  useEffect(() => {
    if (type === "paragraphs") {
      setCount((prev) => Math.min(Math.max(prev, 1), 20));
    } else if (type === "sentences") {
      setCount((prev) => Math.min(Math.max(prev, 1), 30));
    } else if (type === "words") {
      setCount((prev) => Math.min(Math.max(prev, 5), 500));
    } else if (type === "lists") {
      setCount((prev) => Math.min(Math.max(prev, 3), 15));
    }
  }, [type]);

  useEffect(() => {
    generateLorem();
  }, [generateLorem]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Placeholder text copied");
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const getSliderMax = () => {
    switch (type) {
      case "paragraphs": return 20;
      case "sentences": return 30;
      case "words": return 500;
      case "lists": return 15;
      default: return 20;
    }
  };

  const getSliderMin = () => {
    if (type === "words") return 5;
    if (type === "lists") return 3;
    return 1;
  };

  const getSliderStep = () => {
    if (type === "words") return 5;
    return 1;
  };

  const howToUse = [
    { step: "Configure Generation Type", description: "Select between Paragraphs, Sentences, Words, or Lists formatting styles." },
    { step: "Adjust Count & Modifiers", description: "Slide to set the quantity. Toggle starting with 'Lorem Ipsum' or including HTML elements." },
    { step: "Copy Content", description: "Generate matching text and copy to clipboard to use in layouts or editor formats." },
  ];

  const faqs = [
    {
      question: "Where did Lorem Ipsum come from?",
      answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor, traced the source back to Cicero's philosophical treatise."
    },
    {
      question: "Why use placeholder text?",
      answer: "Using placeholder text helps designers focus on typography, layouts, and spacing hierarchies rather than reading active content. It avoids distracting editors during early wireframing reviews."
    },
    {
      question: "What does the 'HTML Markup' option do?",
      answer: "Checking this box wraps paragraphs in `<p>` tags, sentences in `<p>`, words in `<span>` tags, or lists in `<ul>` / `<li>` formats, enabling quick drop-ins into codebases."
    }
  ];

  const relatedTools = [
    { name: "Text Case Converter", href: "/text-converter" },
    { name: "Diff Checker", href: "/diff-checker" },
    { name: "JSON Formatter", href: "/json-formatter" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Cicero and the Origins of Lorem Ipsum</h3>
      <p>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for context. It originates from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Marcus Tullius Cicero, written in 45 BC.
      </p>
      <h4>Original Cicero Passage (Latin):</h4>
      <blockquote>
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
      </blockquote>
      <h4>English Translation:</h4>
      <blockquote>
        "Nor is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure."
      </blockquote>
    </article>
  );

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Create customizable placeholder text paragraphs, sentences, words, or lists for web and print layouts."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        {/* Controls Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><LayoutGrid className="h-4 w-4" /> Generation Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
              {(["paragraphs", "sentences", "words", "lists"] as const).map((t) => (
                <Button
                  key={t}
                  variant={type === t ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setType(t)}
                  className="rounded-xl font-bold capitalize text-xs"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Sizing Slider */}
          <div className="space-y-3">
            <div className="flex justify-between font-bold text-sm text-muted-foreground">
              <span className="uppercase tracking-wider">Quantity Count</span>
              <span className="text-primary font-mono text-lg">{count} {type}</span>
            </div>
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-mono text-xs text-muted-foreground">{getSliderMin()}</span>
              <Slider
                value={[count]}
                onValueChange={(val) => setCount(Array.isArray(val) ? val[0] : val)}
                min={getSliderMin()}
                max={getSliderMax()}
                step={getSliderStep()}
                className="flex-grow py-4"
              />
              <span className="font-mono text-xs text-muted-foreground">{getSliderMax()}</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b pb-3">
              <Sliders className="h-4 w-4 text-primary" /> Modifiers
            </h3>
            
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary accent-primary"
              />
              <span className="text-sm font-bold text-muted-foreground">
                Start with &quot;Lorem ipsum...&quot;
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeHtml}
                onChange={(e) => setIncludeHtml(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary accent-primary"
              />
              <span className="text-sm font-bold text-muted-foreground">
                Wrap in HTML Markup Tags
              </span>
            </label>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4 scroll-mt-24">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><AlignLeft className="h-4 w-4" /> Generated Output</span>
            <Button onClick={copyToClipboard} size="sm" className="rounded-xl shadow-md font-bold px-4">
              {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />} Copy Text
            </Button>
          </div>
          <Card className="p-6 md:p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] shadow-inner min-h-[350px] max-h-[500px] overflow-y-auto font-medium leading-relaxed select-all">
            <div className="whitespace-pre-wrap font-sans text-base text-zinc-800 dark:text-zinc-200">
              {output}
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
