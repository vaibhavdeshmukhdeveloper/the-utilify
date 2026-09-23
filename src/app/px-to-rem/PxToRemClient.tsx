"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { triggerConfetti } from "@/lib/confetti";
import { 
  Type, 
  Copy, 
  CheckCircle2, 
  ArrowRightLeft, 
  Code, 
  Layers 
} from "lucide-react";
import { toast } from "sonner";

export interface PxToRemClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function PxToRemClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: PxToRemClientProps = {}) {
  const [baseSize, setBaseSize] = useState<number>(16);
  const [pixelInput, setPixelInput] = useState<string>("24");
  const [remInput, setRemInput] = useState<string>("1.5");

  // Clamp generator state
  const [clampMinPx, setClampMinPx] = useState<number>(18);
  const [clampMaxPx, setClampMaxPx] = useState<number>(36);
  const [clampMinVw, setClampMinVw] = useState<number>(375);
  const [clampMaxVw, setClampMaxVw] = useState<number>(1280);

  const [copiedClamp, setCopiedClamp] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Conversion calculations
  const parsedPx = parseFloat(pixelInput) || 0;
  const calculatedRem = baseSize > 0 ? (parsedPx / baseSize).toFixed(4).replace(/\.?0+$/, "") : "0";
  const calculatedEm = calculatedRem;
  const calculatedPt = (parsedPx * 0.75).toFixed(2).replace(/\.?0+$/, "");

  const parsedRem = parseFloat(remInput) || 0;
  const calculatedPx = (parsedRem * baseSize).toFixed(2).replace(/\.?0+$/, "");

  // Fluid clamp calculation
  const clampCode = useMemo(() => {
    const effectiveBase = baseSize > 0 ? baseSize : 16;
    if (clampMaxVw <= clampMinVw || clampMaxPx <= clampMinPx) {
      return `font-size: ${(clampMinPx / effectiveBase).toFixed(3)}rem;`;
    }

    const minRem = (clampMinPx / effectiveBase).toFixed(3);
    const maxRem = (clampMaxPx / effectiveBase).toFixed(3);
    const slope = ((clampMaxPx - clampMinPx) / (clampMaxVw - clampMinVw)) * 100;
    const yAxisIntersection = (-clampMinVw * ((clampMaxPx - clampMinPx) / (clampMaxVw - clampMinVw)) + clampMinPx) / effectiveBase;

    return `font-size: clamp(${minRem}rem, ${yAxisIntersection.toFixed(3)}rem + ${slope.toFixed(2)}vw, ${maxRem}rem);`;
  }, [clampMinPx, clampMaxPx, clampMinVw, clampMaxVw, baseSize]);

  const handleCopyClamp = () => {
    navigator.clipboard.writeText(clampCode);
    setCopiedClamp(true);
    triggerConfetti();
    toast.success("CSS clamp() copied to clipboard!");
    setTimeout(() => setCopiedClamp(false), 2000);
  };

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    triggerConfetti();
    toast.success(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // Standard token lookup table
  const tokenTable = [
    { px: 8, tailwind: "text-xs / p-2", name: "Extra Small" },
    { px: 12, tailwind: "text-xs / p-3", name: "Caption" },
    { px: 14, tailwind: "text-sm / p-3.5", name: "Small Body" },
    { px: 16, tailwind: "text-base / p-4", name: "Standard Body (1rem)" },
    { px: 18, tailwind: "text-lg / p-4.5", name: "Large Body" },
    { px: 20, tailwind: "text-xl / p-5", name: "H4 Subhead" },
    { px: 24, tailwind: "text-2xl / p-6", name: "H3 Heading" },
    { px: 32, tailwind: "text-3xl / p-8", name: "H2 Section Title" },
    { px: 40, tailwind: "text-4xl / p-10", name: "H1 Hero Headline" },
    { px: 48, tailwind: "text-5xl / p-12", name: "Display 1" },
    { px: 64, tailwind: "text-6xl / p-16", name: "Display 2" },
  ];

  const howToUse = [
    { step: "Set Base Root Font Size", description: "Default is 16px (100% browser standard), customizable for custom root themes." },
    { step: "Enter Pixels or REM", description: "Input any pixel value to get exact REM, EM, and PT values in real-time." },
    { step: "Generate Fluid clamp()", description: "Create responsive CSS clamp() typography that scales fluidly without media queries." },
  ];

  const faqs = [
    {
      question: "Why should I use REM instead of Pixels (px) in CSS?",
      answer: "Pixels are absolute units that override user browser accessibility font size preferences. REM units scale relative to the root element (<html>), ensuring your website respects WCAG 2.2 accessibility standards when visually impaired users zoom or configure large text."
    },
    {
      question: "What is the formula to convert PX to REM?",
      answer: "REM = Target Pixel Value ÷ Root Font Size (Default 16px). For example, 24px ÷ 16px = 1.5rem."
    },
    {
      question: "How does the CSS clamp() fluid typography function work?",
      answer: "CSS clamp(min, preferred, max) defines a minimum font size floor, a responsive viewport-scaling middle value (e.g. 1rem + 2vw), and a maximum ceiling, eliminating the need for rigid breakpoint media queries."
    },
    {
      question: "What is the difference between REM and EM?",
      answer: "REM is always relative to the root <html> element, providing predictable global sizing. EM is relative to the font size of its immediate parent element, which causes compound multiplier effects when nested."
    }
  ];

  const relatedTools = [
    { name: "Unit Converter", href: "/unit-converter" },
    { name: "Text Case Converter", href: "/text-converter" },
    { name: "Color Palette", href: "/color-palette" },
  ];

  return (
    <ToolLayout
      title={customTitle || "PX to REM Converter"}
      description={customDescription || "Convert pixel (px) values to relative root em (rem) units instantly for accessible responsive web design, Figma design tokens, and Tailwind CSS."}
      summaryDefinition={customSummaryDefinition || "A PX to REM converter calculates the relative REM value of pixel dimensions based on the root HTML font size (default 16px). It includes bidirectional conversions, fluid CSS clamp() scaling, and Tailwind token cheat sheets."}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-6xl mx-auto space-y-4 text-left">
        {/* Base Size Config Header Toolbar */}
        <div className="bg-card border-2 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-foreground">Root Base Font Size: <span className="font-mono text-primary font-black">{baseSize}px</span></h3>
              <p className="text-[11px] text-muted-foreground">Standard browser standard is 16px (1rem = 16px)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[14, 16, 18].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBaseSize(size)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                    baseSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
            <div className="w-28 sm:w-32">
              <Slider
                value={[baseSize]}
                onValueChange={(v) => setBaseSize(Array.isArray(v) ? v[0] : v)}
                min={10}
                max={24}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Converters & Clamp Generator */}
          <div className="lg:col-span-6 space-y-4">
            {/* Live Converter Dual Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PX to REM Card */}
              <Card className="p-4 sm:p-5 rounded-2xl border-2 bg-card space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h3 className="font-black text-sm text-foreground flex items-center gap-1.5">
                    <ArrowRightLeft className="w-4 h-4 text-primary" /> PX &rarr; REM
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">{baseSize}px</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Pixels (px)</label>
                  <Input
                    type="number"
                    value={pixelInput}
                    onChange={(e) => setPixelInput(e.target.value)}
                    className="rounded-xl text-xl font-black font-mono h-11 border-2 focus:border-primary"
                    placeholder="24"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Result</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyToken(`${calculatedRem}rem`)}
                      className="rounded-lg h-7 px-2 text-[11px] font-bold gap-1 text-primary hover:bg-primary/5"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <p className="text-2xl font-black font-mono text-primary">{calculatedRem}rem</p>
                  <div className="flex gap-3 text-[11px] text-muted-foreground font-mono pt-1.5 border-t">
                    <span>EM: <strong>{calculatedEm}em</strong></span>
                    <span>PT: <strong>{calculatedPt}pt</strong></span>
                  </div>
                </div>
              </Card>

              {/* REM to PX Card */}
              <Card className="p-4 sm:p-5 rounded-2xl border-2 bg-card space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h3 className="font-black text-sm text-foreground flex items-center gap-1.5">
                    <ArrowRightLeft className="w-4 h-4 text-primary" /> REM &rarr; PX
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">{baseSize}px</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">REM (rem)</label>
                  <Input
                    type="number"
                    step="0.125"
                    value={remInput}
                    onChange={(e) => setRemInput(e.target.value)}
                    className="rounded-xl text-xl font-black font-mono h-11 border-2 focus:border-primary"
                    placeholder="1.5"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Result</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyToken(`${calculatedPx}px`)}
                      className="rounded-lg h-7 px-2 text-[11px] font-bold gap-1 text-foreground hover:bg-muted"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <p className="text-2xl font-black font-mono text-foreground">{calculatedPx}px</p>
                  <div className="flex gap-2 text-[11px] text-muted-foreground font-mono pt-1.5 border-t truncate">
                    <span>{remInput}rem × {baseSize}px = {calculatedPx}px</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Fluid Typography CSS clamp() Generator */}
            <Card className="p-4 sm:p-5 rounded-2xl border-2 bg-card space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-foreground">Fluid Typography CSS clamp() Generator</h3>
                    <p className="text-[10px] text-muted-foreground">Self-scaling font sizes between viewports</p>
                  </div>
                </div>
                <Button
                  onClick={handleCopyClamp}
                  size="sm"
                  className="rounded-xl h-8 px-3 font-bold text-xs gap-1"
                >
                  {copiedClamp ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedClamp ? "Copied!" : "Copy clamp()"}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Min Size</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={clampMinPx}
                      onChange={(e) => setClampMinPx(parseFloat(e.target.value) || 0)}
                      className="rounded-lg font-bold font-mono h-9 text-xs"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Size</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={clampMaxPx}
                      onChange={(e) => setClampMaxPx(parseFloat(e.target.value) || 0)}
                      className="rounded-lg font-bold font-mono h-9 text-xs"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Min Viewport</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={clampMinVw}
                      onChange={(e) => setClampMinVw(parseFloat(e.target.value) || 0)}
                      className="rounded-lg font-bold font-mono h-9 text-xs"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Viewport</label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={clampMaxVw}
                      onChange={(e) => setClampMaxVw(parseFloat(e.target.value) || 0)}
                      className="rounded-lg font-bold font-mono h-9 text-xs"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">px</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                <code>{clampCode}</code>
              </div>
            </Card>
          </div>

          {/* Right Column: Standard Design Token Table (Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-4 space-y-3 scroll-mt-24">
            <Card className="p-4 sm:p-5 rounded-2xl border-2 bg-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-foreground">PX &harr; REM & Tailwind Spacing Cheat Sheet</h3>
                    <p className="text-[10px] text-muted-foreground">1-click copy values</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">{tokenTable.length} tokens</span>
              </div>

              <div className="max-h-[460px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b text-[10px] font-black uppercase text-muted-foreground">
                      <th className="pb-2">Pixels</th>
                      <th className="pb-2">REM</th>
                      <th className="pb-2">Tailwind Token</th>
                      <th className="pb-2">Usage</th>
                      <th className="pb-2 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono">
                    {tokenTable.map((row) => {
                      const safeBase = baseSize > 0 ? baseSize : 16;
                      const remVal = `${(row.px / safeBase).toFixed(row.px % safeBase === 0 ? 1 : 3)}rem`;
                      return (
                        <tr key={row.px} className="hover:bg-muted/50 transition-colors">
                          <td className="py-2 font-bold text-foreground">{row.px}px</td>
                          <td className="py-2 text-primary font-bold">{remVal}</td>
                          <td className="py-2 text-muted-foreground text-[11px]">{row.tailwind}</td>
                          <td className="py-2 text-muted-foreground font-sans text-[11px] truncate max-w-[90px]">{row.name}</td>
                          <td className="py-2 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyToken(remVal)}
                              className="h-7 w-7 p-0 rounded-md"
                              title={`Copy ${remVal}`}
                            >
                              {copiedToken === remVal ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
