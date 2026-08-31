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
  Sparkles, 
  Code, 
  Layers, 
  Maximize2 
} from "lucide-react";
import { toast } from "sonner";

export default function PxToRemClient() {
  const [baseSize, setBaseSize] = useState<number>(16);
  const [pixelInput, setPixelInput] = useState<string>("24");
  const [remInput, setRemInput] = useState<string>("1.5");
  const [activeTab, setActiveTab] = useState<"px-to-rem" | "rem-to-px">("px-to-rem");

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
    if (clampMaxVw <= clampMinVw || clampMaxPx <= clampMinPx) {
      return `font-size: ${(clampMinPx / baseSize).toFixed(3)}rem;`;
    }

    const minRem = (clampMinPx / baseSize).toFixed(3);
    const maxRem = (clampMaxPx / baseSize).toFixed(3);
    const slope = ((clampMaxPx - clampMinPx) / (clampMaxVw - clampMinVw)) * 100;
    const yAxisIntersection = (-clampMinVw * ((clampMaxPx - clampMinPx) / (clampMaxVw - clampMinVw)) + clampMinPx) / baseSize;

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
      title="PX to REM Converter"
      description="Convert pixel (px) values to relative root em (rem) units instantly for accessible responsive web design, Figma design tokens, and Tailwind CSS."
      summaryDefinition="A PX to REM converter calculates the relative REM value of pixel dimensions based on the root HTML font size (default 16px). It includes bidirectional conversions, fluid CSS clamp() scaling, and Tailwind token cheat sheets."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Base Size Config Header */}
        <div className="bg-card border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Type className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Root Base Font Size</h3>
              <p className="text-xs text-muted-foreground">Standard browser default is 16px (1rem = 16px)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-mono text-primary">{baseSize}px Base</span>
            <div className="w-32">
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

        {/* Live Converter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PX to REM Card */}
          <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> Pixels to REM
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">Base: {baseSize}px</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Enter Pixels (px)</label>
              <Input
                type="number"
                value={pixelInput}
                onChange={(e) => setPixelInput(e.target.value)}
                className="rounded-2xl text-2xl font-black font-mono h-14"
                placeholder="24"
              />
            </div>

            <div className="p-5 rounded-2xl bg-muted/40 border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Result in REM</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyToken(`${calculatedRem}rem`)}
                  className="rounded-xl h-8 px-3 text-xs font-bold gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <p className="text-3xl font-black font-mono text-primary">{calculatedRem}rem</p>
              <div className="flex gap-4 text-xs text-muted-foreground font-mono pt-2 border-t">
                <span>EM: <strong>{calculatedEm}em</strong></span>
                <span>Points: <strong>{calculatedPt}pt</strong></span>
              </div>
            </div>
          </Card>

          {/* REM to PX Card */}
          <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> REM to Pixels
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">Base: {baseSize}px</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Enter REM (rem)</label>
              <Input
                type="number"
                step="0.125"
                value={remInput}
                onChange={(e) => setRemInput(e.target.value)}
                className="rounded-2xl text-2xl font-black font-mono h-14"
                placeholder="1.5"
              />
            </div>

            <div className="p-5 rounded-2xl bg-muted/40 border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Result in Pixels</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyToken(`${calculatedPx}px`)}
                  className="rounded-xl h-8 px-3 text-xs font-bold gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <p className="text-3xl font-black font-mono text-foreground">{calculatedPx}px</p>
              <div className="flex gap-4 text-xs text-muted-foreground font-mono pt-2 border-t">
                <span>Calculation: {remInput}rem × {baseSize}px = {calculatedPx}px</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Fluid Typography CSS clamp() Generator */}
        <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground">Fluid Typography CSS clamp() Generator</h3>
                <p className="text-xs text-muted-foreground">Self-scaling font sizes between mobile and desktop viewports</p>
              </div>
            </div>
            <Button
              onClick={handleCopyClamp}
              className="rounded-xl h-10 px-4 font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {copiedClamp ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedClamp ? "Copied CSS!" : "Copy clamp()"}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Min Size (Mobile)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={clampMinPx}
                  onChange={(e) => setClampMinPx(parseFloat(e.target.value) || 0)}
                  className="rounded-xl font-bold font-mono h-11"
                />
                <span className="text-xs font-mono text-muted-foreground">px</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Max Size (Desktop)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={clampMaxPx}
                  onChange={(e) => setClampMaxPx(parseFloat(e.target.value) || 0)}
                  className="rounded-xl font-bold font-mono h-11"
                />
                <span className="text-xs font-mono text-muted-foreground">px</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Min Viewport</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={clampMinVw}
                  onChange={(e) => setClampMinVw(parseFloat(e.target.value) || 0)}
                  className="rounded-xl font-bold font-mono h-11"
                />
                <span className="text-xs font-mono text-muted-foreground">px</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Max Viewport</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={clampMaxVw}
                  onChange={(e) => setClampMaxVw(parseFloat(e.target.value) || 0)}
                  className="rounded-xl font-bold font-mono h-11"
                />
                <span className="text-xs font-mono text-muted-foreground">px</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-100 font-mono text-sm overflow-x-auto border border-zinc-800 flex items-center justify-between">
            <code>{clampCode}</code>
          </div>
        </Card>

        {/* Standard Design Token Conversion Table */}
        <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-foreground">Standard PX &harr; REM Conversion & Tailwind Cheat Sheet</h3>
              <p className="text-xs text-muted-foreground">Click any REM value to copy immediately</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs font-black uppercase text-muted-foreground">
                  <th className="pb-3">Pixels (px)</th>
                  <th className="pb-3">REM Value (rem)</th>
                  <th className="pb-3">Tailwind Utility</th>
                  <th className="pb-3">Typical Usage</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono">
                {tokenTable.map((row) => {
                  const remVal = `${(row.px / baseSize).toFixed(row.px % baseSize === 0 ? 1 : 3)}rem`;
                  return (
                    <tr key={row.px} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 font-bold text-foreground">{row.px}px</td>
                      <td className="py-3 text-primary font-bold">{remVal}</td>
                      <td className="py-3 text-muted-foreground text-xs">{row.tailwind}</td>
                      <td className="py-3 text-muted-foreground font-sans text-xs">{row.name}</td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyToken(remVal)}
                          className="h-8 px-2.5 text-xs font-bold"
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
    </ToolLayout>
  );
}
