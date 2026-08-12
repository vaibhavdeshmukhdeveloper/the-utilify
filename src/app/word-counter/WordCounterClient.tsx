"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Trash2, 
  Clipboard, 
  Type, 
  Sparkles, 
  Clock, 
  Mic, 
  BookOpen, 
  BarChart3, 
  RotateCcw,
  FileText,
  AlertCircle,
  Share2
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

const COMMON_STOP_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", 
  "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", 
  "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", 
  "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", 
  "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", 
  "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", 
  "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", 
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", 
  "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
]);

const SAMPLE_TEXT = `Utilify is a professional-grade suite of free online productivity tools built for content creators, developers, students, and digital marketers. Every utility is engineered with a privacy-first approach, processing text and media right inside your browser without uploading confidential data to cloud servers.

Whether you are optimizing article readability, checking word limits for academic essays, or crafting social media captions for Twitter and LinkedIn, Utilify provides instant calculations with zero subscription fees.`;

export default function WordCounterClient() {
  const [text, setText] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Auto-restore draft from local storage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("utilify-word-counter-draft");
      if (saved !== null && saved.trim() !== "") {
        setText(saved);
      } else {
        setText(SAMPLE_TEXT);
      }
    } catch {
      setText(SAMPLE_TEXT);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on text change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("utilify-word-counter-draft", text);
    } catch (e) {
      console.error(e);
    }
  }, [text, isLoaded]);

  // Calculations
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const rawWords = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = rawWords.length;
  const lineCount = text === "" ? 0 : text.split("\n").length;
  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Time & Length estimates
  const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 wpm
  const speakingTimeMinutes = Math.ceil(wordCount / 130); // 130 wpm
  const estimatedPages = wordCount === 0 ? "0.0" : (wordCount / 250).toFixed(1); // 250 words per page

  // Keyword Density calculation
  const getTopKeywords = () => {
    if (wordCount === 0) return [];
    const freqMap: Record<string, number> = {};
    
    rawWords.forEach((word) => {
      const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleaned.length > 2 && !COMMON_STOP_WORDS.has(cleaned)) {
        freqMap[cleaned] = (freqMap[cleaned] || 0) + 1;
      }
    });

    return Object.entries(freqMap)
      .map(([word, count]) => ({
        word,
        count,
        density: Math.round((count / wordCount) * 100 * 10) / 10
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const topKeywords = getTopKeywords();

  // Social media character limit trackers
  const socialLimits = [
    { name: "X / Twitter", limit: 280, count: charCount },
    { name: "Meta Title", limit: 60, count: charCount },
    { name: "Meta Description", limit: 160, count: charCount },
    { name: "Instagram Bio / Caption", limit: 2200, count: charCount },
    { name: "LinkedIn Post", limit: 3000, count: charCount }
  ];

  // Actions
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

  const loadSample = () => {
    setText(SAMPLE_TEXT);
    toast.success("Sample text loaded");
  };

  // Case Conversion Helpers
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

  const toUppercase = () => {
    setText(text.toUpperCase());
    toast.success("Converted to UPPERCASE");
  };

  const toLowercase = () => {
    setText(text.toLowerCase());
    toast.success("Converted to lowercase");
  };

  const removeExtraSpaces = () => {
    const cleaned = text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
    setText(cleaned);
    toast.success("Removed extra whitespace");
  };

  const removeLineBreaks = () => {
    const cleaned = text.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
    setText(cleaned);
    toast.success("Removed line breaks");
  };

  const copySummary = () => {
    const summary = `--- Utilify Text Analysis Summary ---
Words: ${wordCount}
Characters (with spaces): ${charCount}
Characters (no spaces): ${charNoSpaces}
Sentences: ${sentenceCount}
Paragraphs: ${paragraphCount}
Reading Time: ${readingTimeMinutes} min
Speaking Time: ${speakingTimeMinutes} min
Est. Pages: ${estimatedPages}`;
    
    navigator.clipboard.writeText(summary);
    toast.success("Copied summary to clipboard");
  };

  const howToUse = [
    { step: "Type or Paste Content", description: "Write directly into the editor or click 'Paste' to import text from your clipboard." },
    { step: "Review Live Statistics", description: "Monitor word count, sentence structures, reading time, and social media character limits instantaneously." },
    { step: "Analyze & Format", description: "Inspect top keyword frequencies, clean up whitespace, or convert text case with one click." },
  ];

  const faqs = [
    {
      question: "How accurately does this tool count words?",
      answer: "Utilify uses standard unicode whitespace regex delimiters to split text into distinct words. Hyphenated words and special symbols are processed cleanly in real-time."
    },
    {
      question: "How is estimated reading time calculated?",
      answer: "Reading time is based on the industry standard average adult reading speed of 200 words per minute (WPM). Speaking time uses 130 WPM."
    },
    {
      question: "Is my text saved or sent to a server?",
      answer: "No! All computations run 100% locally inside your web browser. Your drafts are automatically saved to your browser's private local storage so you don't lose work."
    },
    {
      question: "What is the average word count for a printed page?",
      answer: "A standard single-spaced page with 12pt font holds roughly 500 words, while a double-spaced page holds about 250 words. Our page counter uses the standard 250-word estimate."
    }
  ];

  const relatedTools = [
    { name: "Text Case Converter", href: "/text-converter" },
    { name: "Lorem Ipsum Generator", href: "/lorem-ipsum" },
    { name: "Markdown to PDF", href: "/markdown-to-pdf" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Mastering Word & Character Counts for SEO and Writing</h3>
      <p>
        Maintaining precise word counts and character boundaries is essential across journalism, academic writing, software development, and digital marketing.
      </p>
      <h4>Key Word Count Guidelines by Platform:</h4>
      <ul>
        <li><strong>X / Twitter Posts:</strong> Maximum 280 characters. Keeping tweets under 200 characters improves retweets and engagement.</li>
        <li><strong>Google Search Meta Titles:</strong> Recommended 50–60 characters (~600px width). Titles exceeding 60 characters get truncated with ellipses in Google SERPs.</li>
        <li><strong>Google Search Meta Descriptions:</strong> Recommended 150–160 characters. Provide a compelling call-to-action within this limit.</li>
        <li><strong>Blog Posts & Articles:</strong> Comprehensive long-form guides usually perform best in organic search at 1,500–2,500 words.</li>
        <li><strong>LinkedIn Posts:</strong> Up to 3,000 characters. Hook readers in the first 140 characters before the "...see more" cutoff.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Word Counter & Text Analyzer"
      description="Calculate words, characters, reading time, keyword density, and social media limits in real-time."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-left">
        {/* Main Stats Header Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-4 text-center bg-primary/5 border-primary/20 shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-primary font-mono">{wordCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1 flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" /> Words
            </div>
          </Card>

          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-foreground font-mono">{charCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1 flex items-center justify-center gap-1">
              <Type className="h-3 w-3" /> Characters
            </div>
          </Card>

          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-foreground font-mono">{charNoSpaces}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">
              No Spaces
            </div>
          </Card>

          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-foreground font-mono">{sentenceCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">
              Sentences
            </div>
          </Card>

          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-foreground font-mono">{paragraphCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">
              Paragraphs
            </div>
          </Card>

          <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm rounded-2xl">
            <div className="text-3xl font-black text-foreground font-mono">{lineCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">
              Lines
            </div>
          </Card>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Type className="h-4 w-4 text-primary" /> Content Editor
            </span>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadSample} 
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Load Sample
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={pasteFromClipboard} 
                className="text-xs font-bold text-muted-foreground hover:text-primary"
              >
                <Clipboard className="h-3.5 w-3.5 mr-1" /> Paste
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearText} 
                className="text-xs font-bold text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </div>
          </div>

          <div className="relative scroll-mt-24">
            <Textarea
              className="min-h-[280px] text-lg font-medium p-6 rounded-3xl border-2 focus:border-primary bg-background shadow-inner leading-relaxed"
              placeholder="Type, paste, or start writing your content here to see real-time statistics..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <CopyButton
              value={text}
              className="absolute right-4 bottom-4 w-10 h-10 shadow-md"
              size="icon"
              title="Copy text content"
            />
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground font-medium px-2">
            <span>✨ Auto-saved locally in browser</span>
            <button 
              onClick={copySummary}
              className="hover:text-primary font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Share2 className="h-3 w-3" /> Copy Full Stats Summary
            </button>
          </div>
        </div>

        {/* Secondary Metrics: Time & Reading Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-card border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reading Time</div>
              <div className="text-lg font-black text-foreground font-mono">{readingTimeMinutes} min <span className="text-xs font-normal text-muted-foreground">(~200 wpm)</span></div>
            </div>
          </Card>

          <Card className="p-5 bg-card border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Speaking Time</div>
              <div className="text-lg font-black text-foreground font-mono">{speakingTimeMinutes} min <span className="text-xs font-normal text-muted-foreground">(~130 wpm)</span></div>
            </div>
          </Card>

          <Card className="p-5 bg-card border rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Est. Printed Pages</div>
              <div className="text-lg font-black text-foreground font-mono">{estimatedPages} pages <span className="text-xs font-normal text-muted-foreground">(250 words/pg)</span></div>
            </div>
          </Card>
        </div>

        {/* Social Media & SEO Limit Trackers */}
        <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-3">
            <AlertCircle className="h-4 w-4 text-primary" /> Social Media & Meta Tag Limit Trackers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLimits.map((item) => {
              const percentage = Math.min(Math.round((item.count / item.limit) * 100), 100);
              const isOver = item.count > item.limit;
              
              return (
                <div key={item.name} className="p-4 bg-background rounded-2xl border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">{item.name}</span>
                    <span className={`font-mono font-bold ${isOver ? "text-red-500" : "text-muted-foreground"}`}>
                      {item.count} / {item.limit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isOver ? "bg-red-500" : percentage > 85 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isOver && (
                    <div className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                      ⚠️ Exceeds limit by {item.count - item.limit} chars
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Keyword Density Analyzer & Quick Formatting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keyword Density */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-3">
              <BarChart3 className="h-4 w-4 text-primary" /> Top Keyword Density
            </h3>

            {topKeywords.length > 0 ? (
              <div className="space-y-3">
                {topKeywords.map((item) => (
                  <div key={item.word} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold font-mono text-foreground w-28 truncate">{item.word}</span>
                    <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/80 rounded-full"
                        style={{ width: `${Math.min(item.density * 10, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-muted-foreground font-bold shrink-0">
                      {item.count}x ({item.density}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center italic">
                Type more text to view keyword density distribution...
              </p>
            )}
          </div>

          {/* Quick Text Cleaners & Formatting */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-3">
              <Sparkles className="h-4 w-4 text-primary" /> Quick Text Cleaners
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={toTitleCase} variant="outline" className="rounded-xl font-bold text-xs shadow-sm">
                Title Case
              </Button>
              <Button onClick={toUppercase} variant="outline" className="rounded-xl font-bold text-xs shadow-sm">
                UPPERCASE
              </Button>
              <Button onClick={toLowercase} variant="outline" className="rounded-xl font-bold text-xs shadow-sm">
                lowercase
              </Button>
              <Button onClick={removeExtraSpaces} variant="outline" className="rounded-xl font-bold text-xs shadow-sm">
                Remove Extra Spaces
              </Button>
              <Button onClick={removeLineBreaks} variant="outline" className="rounded-xl font-bold text-xs shadow-sm col-span-2">
                Remove Line Breaks
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
