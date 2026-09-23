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

export interface WordCounterClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function WordCounterClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: WordCounterClientProps = {}) {
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
      title={customTitle || "Word Counter & Text Analyzer"}
      description={customDescription || "Calculate words, characters, reading time, keyword density, and social media limits in real-time."}
      summaryDefinition={customSummaryDefinition}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto space-y-4 text-left">
        {/* Main Stats Header Ribbon - High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
          <Card className="p-3 text-center bg-primary/5 border-2 border-primary/20 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-primary font-mono">{wordCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5 flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" /> Words
            </div>
          </Card>

          <Card className="p-3 text-center bg-card border-2 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">{charCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5 flex items-center justify-center gap-1">
              <Type className="h-3 w-3" /> Characters
            </div>
          </Card>

          <Card className="p-3 text-center bg-card border-2 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">{charNoSpaces}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">
              No Spaces
            </div>
          </Card>

          <Card className="p-3 text-center bg-card border-2 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">{sentenceCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">
              Sentences
            </div>
          </Card>

          <Card className="p-3 text-center bg-card border-2 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">{paragraphCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">
              Paragraphs
            </div>
          </Card>

          <Card className="p-3 text-center bg-card border-2 shadow-xs rounded-xl">
            <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">{lineCount}</div>
            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">
              Lines
            </div>
          </Card>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Content Editor & Quick Text Cleaners (lg:col-span-7 space-y-4) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Text Area Card */}
            <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs bg-card space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-primary" /> Content Editor
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadSample} 
                    className="h-8 px-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" /> Load Sample
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={pasteFromClipboard} 
                    className="h-8 px-2.5 text-xs font-bold text-muted-foreground hover:text-primary"
                  >
                    <Clipboard className="h-3 w-3 mr-1" /> Paste
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearText} 
                    className="h-8 px-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Clear
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  className="min-h-[260px] text-base font-medium p-4 rounded-xl border-2 focus:border-primary bg-background shadow-inner leading-relaxed"
                  placeholder="Type, paste, or start writing your content here to see real-time statistics..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <CopyButton
                  value={text}
                  className="absolute right-3 bottom-3 w-8 h-8 shadow-sm"
                  size="icon"
                  title="Copy text content"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground font-medium pt-1">
                <span>✨ Auto-saved locally in browser</span>
                <button 
                  onClick={copySummary}
                  className="hover:text-primary font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Share2 className="h-3 w-3" /> Copy Full Stats Summary
                </button>
              </div>
            </Card>

            {/* Quick Text Cleaners & Formatting */}
            <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs bg-card space-y-3">
              <h3 className="text-xs font-black flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Quick Text Cleaners
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button onClick={toTitleCase} variant="outline" className="h-9 rounded-xl font-bold text-xs shadow-xs">
                  Title Case
                </Button>
                <Button onClick={toUppercase} variant="outline" className="h-9 rounded-xl font-bold text-xs shadow-xs">
                  UPPERCASE
                </Button>
                <Button onClick={toLowercase} variant="outline" className="h-9 rounded-xl font-bold text-xs shadow-xs">
                  lowercase
                </Button>
                <Button onClick={removeExtraSpaces} variant="outline" className="h-9 rounded-xl font-bold text-xs shadow-xs">
                  Clean Spaces
                </Button>
                <Button onClick={removeLineBreaks} variant="outline" className="h-9 rounded-xl font-bold text-xs shadow-xs col-span-2 sm:col-span-4">
                  Remove Line Breaks
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Real-Time Sticky Analysis (lg:col-span-5 lg:sticky lg:top-4 space-y-3.5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-3.5 scroll-mt-24">
            {/* Reading / Speaking / Pages Estimate Card */}
            <Card className="p-4 rounded-2xl border-2 shadow-xs bg-card space-y-3">
              <h3 className="text-xs font-black flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> Reading & Speaking Estimates
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Reading</div>
                  <div className="text-base font-black text-foreground font-mono mt-0.5">{readingTimeMinutes} min</div>
                  <div className="text-[9px] text-muted-foreground">~200 wpm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Speaking</div>
                  <div className="text-base font-black text-foreground font-mono mt-0.5">{speakingTimeMinutes} min</div>
                  <div className="text-[9px] text-muted-foreground">~130 wpm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Est. Pages</div>
                  <div className="text-base font-black text-foreground font-mono mt-0.5">{estimatedPages}</div>
                  <div className="text-[9px] text-muted-foreground">250 w/page</div>
                </div>
              </div>
            </Card>

            {/* Social Media & SEO Limit Trackers */}
            <Card className="p-4 rounded-2xl border-2 shadow-xs bg-card space-y-3">
              <h3 className="text-xs font-black flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-2">
                <AlertCircle className="h-3.5 w-3.5 text-primary" /> Social Media & Meta Tag Trackers
              </h3>
              <div className="space-y-2">
                {socialLimits.map((item) => {
                  const percentage = Math.min(Math.round((item.count / item.limit) * 100), 100);
                  const isOver = item.count > item.limit;
                  
                  return (
                    <div key={item.name} className="p-2.5 bg-muted/30 rounded-xl border border-border/50 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground text-[11px]">{item.name}</span>
                        <span className={`font-mono text-[11px] font-bold ${isOver ? "text-red-500" : "text-muted-foreground"}`}>
                          {item.count} / {item.limit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${isOver ? "bg-red-500" : percentage > 85 ? "bg-amber-500" : "bg-primary"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isOver && (
                        <div className="text-[9px] text-red-500 font-bold">
                          ⚠️ Exceeds limit by {item.count - item.limit} chars
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Top Keyword Density */}
            <Card className="p-4 rounded-2xl border-2 shadow-xs bg-card space-y-3">
              <h3 className="text-xs font-black flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider border-b pb-2">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Top Keyword Density
              </h3>

              {topKeywords.length > 0 ? (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {topKeywords.map((item) => (
                    <div key={item.word} className="flex items-center justify-between gap-2.5 text-xs">
                      <span className="font-bold font-mono text-foreground text-[11px] w-24 truncate">{item.word}</span>
                      <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary/80 rounded-full"
                          style={{ width: `${Math.min(item.density * 10, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground font-bold shrink-0">
                        {item.count}x ({item.density}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-3 text-center italic">
                  Type more text to view keyword density distribution...
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
