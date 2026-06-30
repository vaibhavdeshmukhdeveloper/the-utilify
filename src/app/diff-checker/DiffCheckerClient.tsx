"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { GitCompare, Eye, FileText, ArrowRight, Trash2 } from "lucide-react";

interface DiffLine {
  text: string;
  type: "unchanged" | "added" | "removed" | "empty";
  num?: number;
}

export default function DiffCheckerClient() {
  const [originalText, setOriginalText] = useState(
    "Utilify is a great suite of tools.\nIt has 10 useful utilities.\nEverything runs client-side for maximum privacy."
  );
  const [modifiedText, setModifiedText] = useState(
    "Utilify is an awesome suite of premium tools!\nIt now has 20 useful utilities.\nEverything runs client-side for maximum privacy."
  );

  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [hasCompared, setHasCompared] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasCompared && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasCompared]);
  const [diffResult, setDiffResult] = useState<{
    left: DiffLine[];
    right: DiffLine[];
    unified: { text: string; type: "unchanged" | "added" | "removed"; oldNum?: number; newNum?: number }[];
  } | null>(null);

  const compareText = () => {
    const oldLines = originalText.split("\n");
    const newLines = modifiedText.split("\n");
    const M = oldLines.length;
    const N = newLines.length;

    // LCS DP Table
    const dp: number[][] = Array(M + 1)
      .fill(null)
      .map(() => Array(N + 1).fill(0));

    for (let i = 1; i <= M; i++) {
      for (let j = 1; j <= N; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack for split view
    let i = M, j = N;
    const left: DiffLine[] = [];
    const right: DiffLine[] = [];
    const unified: { text: string; type: "unchanged" | "added" | "removed"; oldNum?: number; newNum?: number }[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        left.unshift({ text: oldLines[i - 1], type: "unchanged", num: i });
        right.unshift({ text: newLines[j - 1], type: "unchanged", num: j });
        unified.unshift({ text: oldLines[i - 1], type: "unchanged", oldNum: i, newNum: j });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        left.unshift({ text: "", type: "empty" });
        right.unshift({ text: newLines[j - 1], type: "added", num: j });
        unified.unshift({ text: newLines[j - 1], type: "added", newNum: j });
        j--;
      } else {
        left.unshift({ text: oldLines[i - 1], type: "removed", num: i });
        right.unshift({ text: "", type: "empty" });
        unified.unshift({ text: oldLines[i - 1], type: "removed", oldNum: i });
        i--;
      }
    }

    setDiffResult({ left, right, unified });
    setHasCompared(true);
    toast.success("Comparison completed");
  };

  const clearInputs = () => {
    setOriginalText("");
    setModifiedText("");
    setHasCompared(false);
    setDiffResult(null);
    toast.success("Editors cleared");
  };

  const howToUse = [
    { step: "Input Original Text", description: "Paste your source or original text block into the left editor panel." },
    { step: "Input Modified Text", description: "Paste your edited or secondary text block into the right editor panel." },
    { step: "Analyze Differences", description: "Click Compare. Switch between side-by-side Split View or unified Inline View." },
  ];

  const faqs = [
    {
      question: "How does the comparison algorithm highlight changes?",
      answer: "We use a line-level Longest Common Subsequence (LCS) backtrack algorithm. Deleted lines are highlighted in red (left) and newly added lines are highlighted in green (right)."
    },
    {
      question: "Can I compare code snippets?",
      answer: "Yes, definitely. You can compare source code files, JSON outputs, lists, HTML scripts, or plain text articles to identify exact adjustments."
    },
    {
      question: "Are there character limit limitations?",
      answer: "While there is no hard limit, the comparison runs client-side. Processing files with thousands of lines may take a brief moment as the browser builds the LCS matrix."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Text Case Converter", href: "/text-converter" },
    { name: "Lorem Ipsum Generator", href: "/lorem-ipsum" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Diff Layouts</h3>
      <p>
        Checking differences is a standard workflow in software development (e.g. <code>git diff</code>), technical writing, and legal audits. It helps highlight updates without reading unchanged text from scratch.
      </p>
      <h4>Split View vs Unified View:</h4>
      <ul>
        <li><strong>Split View (Side-by-Side):</strong> Maps corresponding lines horizontally. Recommended for reading structural revisions.</li>
        <li><strong>Unified View (Inline):</strong> Places additions directly below removals in a single combined timeline. Good for standard terminal output reading.</li>
      </ul>
      <h4>Algorithmic Approach:</h4>
      <p>
        The LCS algorithm solves dynamic programming sub-problems to find the longest sequence of lines shared by both arrays. Unmatched entries indicate edits, allowing the builder to map deletions (red) and additions (green) securely.
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="Diff Checker"
      description="Compare two text blocks side-by-side or inline to highlight and analyze differences instantly."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-left">
        {/* Actions header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="rounded-lg text-xs font-black"
            >
              Split View
            </Button>
            <Button
              variant={viewMode === "unified" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("unified")}
              className="rounded-lg text-xs font-black"
            >
              Unified View
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={clearInputs} className="rounded-xl font-bold border-2 hover:bg-zinc-100">
              <Trash2 className="h-4 w-4 mr-1.5 text-red-500" /> Clear
            </Button>
            <Button size="sm" onClick={compareText} className="rounded-xl shadow-md font-bold px-5">
              <GitCompare className="h-4 w-4 mr-1.5" /> Compare Text
            </Button>
          </div>
        </div>

        {/* Input Editors (Double layout) */}
        {!hasCompared && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Original Text (Before)</label>
              <Textarea
                placeholder="Paste original text here..."
                className="min-h-[300px] rounded-3xl border-2 focus:border-primary p-5 leading-relaxed font-mono text-sm font-semibold"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><GitCompare className="h-3.5 w-3.5" /> Modified Text (After)</label>
              <Textarea
                placeholder="Paste modified text here..."
                className="min-h-[300px] rounded-3xl border-2 focus:border-primary p-5 leading-relaxed font-mono text-sm font-semibold"
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Diff Output */}
        {hasCompared && diffResult && (
          <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 scroll-mt-24">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Eye className="h-4 w-4 text-primary" /> Comparison Results</span>
              <Button variant="ghost" size="sm" onClick={() => setHasCompared(false)} className="text-xs font-bold text-primary">
                Return to Editor <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>

            {viewMode === "split" ? (
              /* Split View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Pane (Original / Removed) */}
                <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-950/20">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-b text-xs font-black text-muted-foreground uppercase">Original Pane</div>
                  <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed divide-y divide-zinc-100 dark:divide-zinc-800/20 max-h-[500px] overflow-y-auto">
                    {diffResult.left.map((line, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 py-1.5 px-2 select-text ${
                          line.type === "removed"
                            ? "bg-red-500/10 text-red-700 dark:text-red-400 font-bold"
                            : line.type === "empty"
                            ? "bg-zinc-100/50 dark:bg-zinc-900/30 opacity-20 select-none"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <span className="w-8 select-none opacity-40 font-bold text-right shrink-0">{line.num || ""}</span>
                        <span className="w-4 select-none opacity-45 shrink-0">{line.type === "removed" ? "-" : ""}</span>
                        <span className="whitespace-pre truncate">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Right Pane (Modified / Added) */}
                <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-950/20">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-b text-xs font-black text-muted-foreground uppercase">Modified Pane</div>
                  <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed divide-y divide-zinc-100 dark:divide-zinc-800/20 max-h-[500px] overflow-y-auto">
                    {diffResult.right.map((line, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 py-1.5 px-2 select-text ${
                          line.type === "added"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 font-bold"
                            : line.type === "empty"
                            ? "bg-zinc-100/50 dark:bg-zinc-900/30 opacity-20 select-none"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <span className="w-8 select-none opacity-40 font-bold text-right shrink-0">{line.num || ""}</span>
                        <span className="w-4 select-none opacity-45 shrink-0">{line.type === "added" ? "+" : ""}</span>
                        <span className="whitespace-pre truncate">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              /* Unified View */
              <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-950/20">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-b text-xs font-black text-muted-foreground uppercase">Unified Timeline</div>
                <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed divide-y divide-zinc-100 dark:divide-zinc-800/20 max-h-[500px] overflow-y-auto">
                  {diffResult.unified.map((line, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 py-1.5 px-2 select-text ${
                        line.type === "added"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 font-bold"
                          : line.type === "removed"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400 font-bold"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <span className="w-6 select-none opacity-40 text-right shrink-0">{line.oldNum || ""}</span>
                      <span className="w-6 select-none opacity-40 text-right shrink-0">{line.newNum || ""}</span>
                      <span className="w-4 select-none opacity-45 shrink-0">
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : ""}
                      </span>
                      <span className="whitespace-pre truncate">{line.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
