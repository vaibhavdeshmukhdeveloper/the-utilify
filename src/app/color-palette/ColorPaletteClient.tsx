"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Lock, Unlock, RefreshCw, Sparkles, Code, Check } from "lucide-react";

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Convert Hex to RGB String
function hexToRgbStr(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Convert Hex to HSL String
function hexToHslStr(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPaletteClient() {
  const [colors, setColors] = useState<{ hex: string; locked: boolean }[]>([
    { hex: "#6366F1", locked: false },
    { hex: "#8B5CF6", locked: false },
    { hex: "#EC4899", locked: false },
    { hex: "#F43F5E", locked: false },
    { hex: "#E11D48", locked: false },
  ]);

  const [schemeType, setSchemeType] = useState("random");
  const [copyFormat, setCopyFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [textContrastColor, setTextContrastColor] = useState("#FFFFFF");
  const [bgContrastColor, setBgContrastColor] = useState("#6366F1");

  // Save to recently used history in local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const href = "/color-palette";
      
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Error setting recently used tools", e);
    }
  }, []);

  // Generate random hex color
  const generateRandomHex = () => {
    const chars = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generatePalette = useCallback(() => {
    if (schemeType === "random") {
      setColors((prev) =>
        prev.map((c) => (c.locked ? c : { ...c, hex: generateRandomHex() }))
      );
    } else {
      // Find the first unlocked color, or use the first color as the base
      const baseIndex = colors.findIndex((c) => c.locked);
      const baseHex = baseIndex !== -1 ? colors[baseIndex].hex : colors[0].hex;

      // Simple HSL harmonics based on baseHex
      const rgb = hexToRgb(baseHex) || { r: 99, g: 102, b: 241 };
      // RGB to HSL approximation
      const r = rgb.r / 255;
      const g = rgb.g / 255;
      const b = rgb.b / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      let newColors: string[] = [];

      switch (schemeType) {
        case "monochromatic":
          newColors = [
            hslToHex(h, s, Math.max(l - 30, 10)),
            hslToHex(h, s, Math.max(l - 15, 20)),
            hslToHex(h, s, l),
            hslToHex(h, Math.max(s - 15, 10), Math.min(l + 15, 90)),
            hslToHex(h, Math.max(s - 30, 5), Math.min(l + 30, 95)),
          ];
          break;
        case "analogous":
          newColors = [
            hslToHex((h + 300) % 360, s, l),
            hslToHex((h + 330) % 360, s, l),
            hslToHex(h, s, l),
            hslToHex((h + 30) % 360, s, l),
            hslToHex((h + 60) % 360, s, l),
          ];
          break;
        case "triadic":
          newColors = [
            hslToHex(h, s, l),
            hslToHex((h + 120) % 360, s, l),
            hslToHex((h + 240) % 360, s, l),
            hslToHex(h, s, Math.max(l - 20, 10)),
            hslToHex((h + 120) % 360, s, Math.min(l + 20, 90)),
          ];
          break;
        case "complementary":
          newColors = [
            hslToHex(h, s, l),
            hslToHex(h, s, Math.max(l - 20, 10)),
            hslToHex((h + 180) % 360, s, l),
            hslToHex((h + 180) % 360, s, Math.min(l + 20, 90)),
            hslToHex((h + 180) % 360, Math.max(s - 20, 10), l),
          ];
          break;
        default:
          newColors = colors.map(() => generateRandomHex());
      }

      setColors((prev) =>
        prev.map((c, i) => (c.locked ? c : { ...c, hex: newColors[i] || generateRandomHex() }))
      );
    }
  }, [schemeType, colors]);

  // Handle spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatePalette]);

  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    } catch {
      toast.error("Failed to copy color hex");
    }
  };

  // WCAG Ratio computations
  const contrastRatio = getContrastRatio(textContrastColor, bgContrastColor);
  const wcagNormalAA = contrastRatio >= 4.5;
  const wcagNormalAAA = contrastRatio >= 7.0;
  const wcagLargeAA = contrastRatio >= 3.0;
  const wcagLargeAAA = contrastRatio >= 4.5;

  const exportAsCSS = () => {
    const cssVars = colors
      .map((c, i) => `  --color-palette-${i + 1}: ${c.hex};`)
      .join("\n");
    const formatted = `:root {\n${cssVars}\n}`;
    copyToClipboard(formatted);
  };

  const exportAsJSON = () => {
    const hexList = colors.map((c) => c.hex);
    copyToClipboard(JSON.stringify(hexList, null, 2));
  };

  const howToUse = [
    { step: "Generate Palette", description: "Press the Spacebar or click the Generate button to rotate colors. Lock colors you want to keep." },
    { step: "Check Accessibility", description: "Use the WCAG tool below to test contrast ratios between your selected colors for readability compliance." },
    { step: "Export Code", description: "Click the Export buttons to copy variables in CSS, Tailwind config, or raw JSON formats." },
  ];

  const faqs = [
    {
      question: "How do I choose colors that are accessible?",
      answer: "Use our contrast checker. The WCAG AA standard requires a contrast ratio of at least 4.5:1 for normal text, and 3:1 for large text. AAA requires 7:1 for normal text. Keeping contrast high ensures readability."
    },
    {
      question: "What does 'locking' a color do?",
      answer: "When you lock a color block, it stays constant when you press Spacebar or click Generate. This allows you to build a cohesive color scheme around a fixed base color."
    },
    {
      question: "What are analogous and triadic colors?",
      answer: "Analogous colors are located adjacent to each other on the color wheel (creating calm designs). Triadic colors are spaced equally around the color wheel (creating vibrant, high-energy designs)."
    }
  ];

  const relatedTools = [
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "QR Code Generator", href: "/qr-generator" },
    { name: "Unit Converter", href: "/unit-converter" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Web Color Theories</h3>
      <p>
        Color plays an essential role in how humans experience digital interfaces. Proper color palettes direct focus, evoke emotional reactions, and satisfy accessibility constraints.
      </p>
      <h4>Harmonic Archetypes:</h4>
      <ul>
        <li><strong>Monochromatic:</strong> Uses varying shades, tones, and tints of a single hue. Creates clean, highly aligned designs.</li>
        <li><strong>Analogous:</strong> Combines colors that sit next to each other on the wheel. Highly relaxing for the eyes.</li>
        <li><strong>Complementary:</strong> Pairs opposing colors (e.g. blue and orange) for high contrast and impact.</li>
        <li><strong>Triadic:</strong> Utilizes three colors equidistant on the color wheel, perfect for playful interfaces.</li>
      </ul>
      <h4>WCAG 2.1 Contrast Standards:</h4>
      <p>
        Relative luminance determines how readable foreground text is over background styling. Poor contrast ratios are the #1 web accessibility issue. Satisfying WCAG AA standards ensures your application is readable for individuals with visual impairments.
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Create beautiful color schemes, verify WCAG readability compliance, and export CSS code."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 text-left">
        {/* Core Generator Card */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              {["random", "monochromatic", "analogous", "triadic", "complementary"].map((type) => (
                <Button
                  key={type}
                  variant={schemeType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSchemeType(type)}
                  className="rounded-lg text-xs font-black capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Copy Format Tabs Selector */}
            <div className="flex items-center gap-2 self-end">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest hidden sm:inline-block">Format:</span>
              <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 gap-1">
                {["hex", "rgb", "hsl"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCopyFormat(fmt as "hex" | "rgb" | "hsl")}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase transition-all cursor-pointer ${
                      copyFormat === fmt
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-zinc-500 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 self-end">
              <Button onClick={generatePalette} className="rounded-xl shadow-md font-bold px-5 h-11">
                <RefreshCw className="mr-2 h-4 w-4" /> Generate <span className="hidden sm:inline ml-1 text-xs opacity-75 font-normal">(or press Space)</span>
              </Button>
            </div>
          </div>

          {/* Palette Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-5 h-[350px] sm:h-[220px] rounded-3xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800">
            {colors.map((color, idx) => {
              // Decide text color (black or white) based on background luminance
              const rgb = hexToRgb(color.hex) || { r: 0, g: 0, b: 0 };
              const lum = getLuminance(rgb.r, rgb.g, rgb.b);
              const textClass = lum > 0.45 ? "text-zinc-900" : "text-white";

              // Get current color string format
              const getColorString = (hex: string) => {
                if (copyFormat === "rgb") return hexToRgbStr(hex);
                if (copyFormat === "hsl") return hexToHslStr(hex);
                return hex;
              };

              const formattedVal = getColorString(color.hex);

              return (
                <div
                  key={idx}
                  className="relative flex sm:flex-col justify-between items-center p-6 h-full transition-all duration-300"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Lock icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLock(idx)}
                    className={`rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${textClass}`}
                  >
                    {color.locked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5 opacity-40 hover:opacity-100" />}
                  </Button>

                  {/* Format color display */}
                  <div className="flex flex-col items-center sm:items-center max-w-full px-2 overflow-hidden text-center">
                    <span
                      onClick={() => copyToClipboard(formattedVal)}
                      className={`font-mono font-black text-sm tracking-tight cursor-pointer hover:scale-105 duration-200 transition-transform ${textClass} break-all select-all`}
                    >
                      {formattedVal}
                    </span>
                  </div>

                  {/* Copy Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(formattedVal)}
                    className={`rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${textClass}`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessibility & Export row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contrast Ratio Check */}
          <Card className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 rounded-3xl space-y-6 scroll-mt-24">
            <h3 className="text-md font-bold flex items-center gap-2 border-b pb-3">
              <Sparkles className="h-5 w-5 text-primary" /> WCAG Contrast Checker
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-10 h-10 p-0.5 rounded-lg border cursor-pointer"
                    value={textContrastColor}
                    onChange={(e) => setTextContrastColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full text-xs font-mono font-bold bg-transparent border-b outline-none uppercase"
                    value={textContrastColor}
                    onChange={(e) => setTextContrastColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-10 h-10 p-0.5 rounded-lg border cursor-pointer"
                    value={bgContrastColor}
                    onChange={(e) => setBgContrastColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full text-xs font-mono font-bold bg-transparent border-b outline-none uppercase"
                    value={bgContrastColor}
                    onChange={(e) => setBgContrastColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Live Text Demo Box */}
            <div
              className="p-4 rounded-2xl border text-center transition-colors font-medium"
              style={{ color: textContrastColor, backgroundColor: bgContrastColor }}
            >
              <div className="text-base font-bold">This is a demonstration of Contrast</div>
              <div className="text-xs opacity-80 mt-1">Make sure it is readable for AA/AAA standards</div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="p-3 bg-white dark:bg-zinc-900 border rounded-xl flex flex-col justify-center items-center">
                <span className="text-muted-foreground">Contrast Ratio</span>
                <span className="text-xl font-black font-mono mt-1 text-primary">{contrastRatio.toFixed(2)} : 1</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Normal Text:</span>
                  <span className={`px-2 py-0.5 rounded font-black text-[10px] ${wcagNormalAA ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {wcagNormalAA ? "AA PASS" : "AA FAIL"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Large Text:</span>
                  <span className={`px-2 py-0.5 rounded font-black text-[10px] ${wcagLargeAAA ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {wcagLargeAAA ? "AAA PASS" : "AAA FAIL"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Export Formats */}
          <Card className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 rounded-3xl space-y-6">
            <h3 className="text-md font-bold flex items-center gap-2 border-b pb-3">
              <Code className="h-5 w-5 text-primary" /> Export Palette
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export your hex colors directly into your developer templates or configuration layouts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={exportAsCSS} className="rounded-xl h-11 font-bold" variant="outline">
                CSS Variables
              </Button>
              <Button onClick={exportAsJSON} className="rounded-xl h-11 font-bold" variant="outline">
                JSON Object
              </Button>
              <Button
                onClick={() => {
                  const format = colors.map((c, i) => `paletteColor${i + 1}: '${c.hex}',`).join("\n");
                  copyToClipboard(format);
                }}
                className="rounded-xl h-11 font-bold sm:col-span-2"
                variant="outline"
              >
                Tailwind Config Theme
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
