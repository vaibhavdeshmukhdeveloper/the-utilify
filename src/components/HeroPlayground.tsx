"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  QrCode, 
  Key, 
  Type, 
  Binary, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ArrowRight, 
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

export function HeroPlayground() {
  const [activeTab, setActiveTab] = useState<"qr" | "password" | "text" | "base64">("qr");

  // Tab 1: QR Generator states
  const [qrText, setQrText] = useState("https://www.theutilify.com");
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;
    if (activeTab === "qr" && qrCanvasRef.current) {
      import("qrcode").then((QRCodeModule) => {
        const QRCode = QRCodeModule.default || QRCodeModule;
        if (!isCancelled && qrCanvasRef.current) {
          QRCode.toCanvas(
            qrCanvasRef.current,
            qrText || "https://www.theutilify.com",
            {
              width: 140,
              margin: 1,
              color: {
                dark: "#6366f1",
                light: "#00000000",
              },
            },
            (err) => {
              if (err) console.error(err);
            }
          );
        }
      }).catch((e) => console.error("Error loading qrcode:", e));
    }
    return () => {
      isCancelled = true;
    };
  }, [qrText, activeTab]);

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const url = qrCanvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "utilify_quick_qr.png";
    link.click();
    triggerConfetti();
    toast.success("QR Code downloaded!");
  };

  // Tab 2: Password Generator states
  const [passLength, setPassLength] = useState([16]);
  const [password, setPassword] = useState("");
  const [copiedPass, setCopiedPass] = useState(false);

  const generatePass = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let res = "";
    const arr = new Uint32Array(passLength[0]);
    crypto.getRandomValues(arr);
    for (let i = 0; i < passLength[0]; i++) {
      res += chars[arr[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePass();
  }, [passLength]);

  const handleCopyPass = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopiedPass(true);
    triggerConfetti();
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopiedPass(false), 2000);
  };

  // Tab 3: Text Converter states
  const [textContent, setTextContent] = useState("Type or paste anything here to transform...");
  const [copiedText, setCopiedText] = useState(false);

  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;

  const transformCase = (type: "upper" | "lower" | "title") => {
    if (type === "upper") setTextContent(textContent.toUpperCase());
    else if (type === "lower") setTextContent(textContent.toLowerCase());
    else if (type === "title") {
      setTextContent(
        textContent.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      );
    }
    triggerConfetti();
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(textContent);
    setCopiedText(true);
    triggerConfetti();
    toast.success("Text copied!");
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Tab 4: Base64 states
  const [base64Input, setBase64Input] = useState("Hello, Utilify!");
  const [base64Output, setBase64Output] = useState("");
  const [copiedB64, setCopiedB64] = useState(false);

  useEffect(() => {
    try {
      setBase64Output(btoa(unescape(encodeURIComponent(base64Input))));
    } catch {
      setBase64Output("Encoding error");
    }
  }, [base64Input]);

  const handleCopyB64 = async () => {
    await navigator.clipboard.writeText(base64Output);
    setCopiedB64(true);
    triggerConfetti();
    toast.success("Base64 copied!");
    setTimeout(() => setCopiedB64(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-card/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/10 relative overflow-hidden text-left">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-foreground flex items-center gap-2">
              Instant Quick-Utility Playground
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">Test our tools live in your browser without leaving this page</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-zinc-900/80 rounded-2xl border w-full sm:w-auto overflow-x-auto">
          {[
            { id: "qr" as const, label: "QR Code", icon: QrCode },
            { id: "password" as const, label: "Password", icon: Key },
            { id: "text" as const, label: "Text Case", icon: Type },
            { id: "base64" as const, label: "Base64", icon: Binary },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-6 relative z-10">
        {/* Tab 1: QR Generator */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-8 space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Enter URL or Plain Text
              </label>
              <Input
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://example.com"
                className="h-12 rounded-xl text-sm font-medium"
              />
              <div className="flex items-center gap-3 pt-1">
                <Button onClick={handleDownloadQr} size="sm" className="rounded-xl font-bold gap-1.5 shadow-md">
                  <Download className="h-3.5 w-3.5" /> Download QR (PNG)
                </Button>
                <Link href="/qr-generator">
                  <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold text-primary gap-1">
                    Full QR Studio <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
              <canvas ref={qrCanvasRef} className="rounded-lg" />
              <span className="text-[10px] font-mono text-zinc-500 mt-2">Live Scannable QR</span>
            </div>
          </div>
        )}

        {/* Tab 2: Password Generator */}
        {activeTab === "password" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl font-mono text-base font-bold text-primary tracking-wider truncate shadow-inner">
                {password}
              </div>
              <Button onClick={generatePass} variant="outline" size="icon" className="h-12 w-12 rounded-2xl shrink-0" title="Regenerate">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={handleCopyPass} className="h-12 px-5 rounded-2xl font-bold gap-2 shrink-0 shadow-md">
                {copiedPass ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                {copiedPass ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="flex items-center justify-between gap-6 pt-1">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-bold text-muted-foreground shrink-0">Length: {passLength[0]}</span>
                <Slider
                  value={passLength}
                  onValueChange={(val) => setPassLength(Array.isArray(val) ? val : [val])}
                  min={8}
                  max={40}
                  step={1}
                  className="flex-1"
                />
              </div>
              <Link href="/password-generator">
                <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold text-primary gap-1">
                  More Options <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Text Converter */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <Input
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="h-12 rounded-xl text-sm font-medium"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Button onClick={() => transformCase("upper")} variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  UPPERCASE
                </Button>
                <Button onClick={() => transformCase("lower")} variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  lowercase
                </Button>
                <Button onClick={() => transformCase("title")} variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  Title Case
                </Button>
                <Button onClick={handleCopyText} size="sm" className="rounded-xl text-xs font-bold gap-1 shadow-sm">
                  {copiedText ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedText ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                <span>{wordCount} Words</span>
                <span>•</span>
                <span>{charCount} Chars</span>
                <Link href="/text-converter">
                  <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold text-primary gap-1 h-8 px-2">
                    Advanced <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Base64 */}
        {activeTab === "base64" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Plain Text</label>
              <Input
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="h-12 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Base64 Encoded</label>
                <button onClick={handleCopyB64} className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1">
                  {copiedB64 ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {copiedB64 ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="h-12 px-3 flex items-center bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 truncate shadow-inner">
                {base64Output}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
