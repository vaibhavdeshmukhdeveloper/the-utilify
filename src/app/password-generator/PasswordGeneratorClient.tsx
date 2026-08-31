"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, Check, RefreshCw, Key, Shield, Info, List, Share2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { copyShareUrl } from "@/lib/share-utils";

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const [strength, setStrength] = useState({ label: "Weak", color: "text-red-500", percent: 25, bg: "bg-red-500" });
  const [history, setHistory] = useState<string[]>([]);

  // Parse deep link parameters on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const l = params.get("length") || params.get("len");
        const upper = params.get("upper") || params.get("uppercase");
        const lower = params.get("lower") || params.get("lowercase");
        const numbers = params.get("numbers") || params.get("digits");
        const symbols = params.get("symbols") || params.get("sym");
        const similar = params.get("excludeSimilar");

        if (l && !isNaN(Number(l))) setLength(Math.max(4, Math.min(64, Number(l))));
        if (upper !== null) setIncludeUpper(upper === "true" || upper === "1");
        if (lower !== null) setIncludeLower(lower === "true" || lower === "1");
        if (numbers !== null) setIncludeNumbers(numbers === "true" || numbers === "1");
        if (symbols !== null) setIncludeSymbols(symbols === "true" || symbols === "1");
        if (similar !== null) setExcludeSimilar(similar === "true" || similar === "1");
      }
    } catch (e) {
      console.error("Error parsing password params", e);
    }
  }, []);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;':\",./<>?";

    if (excludeSimilar) {
      // Exclude i, l, 1, I, o, 0, O, o, etc.
      charset = charset.replace(/[il1I|o0O]/g, "");
    }

    if (!charset) {
      toast.error("Please select at least one character set");
      return;
    }

    let generated = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }

    setPassword(generated);

    // Save to history (keep last 5)
    setHistory((prev) => [generated, ...prev.slice(0, 4)]);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar]);

  // Run on mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Calculate strength based on length & active charsets
  useEffect(() => {
    if (!password) return;
    
    let poolSize = 0;
    if (includeLower) poolSize += 26;
    if (includeUpper) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;
    if (excludeSimilar) poolSize -= 8;

    const entropy = length * Math.log2(Math.max(poolSize, 2));

    let label = "Very Weak";
    let color = "text-red-500";
    let bg = "bg-red-500";
    let percent = 15;

    if (entropy >= 80) {
      label = "Very Strong";
      color = "text-green-500";
      bg = "bg-green-500";
      percent = 100;
    } else if (entropy >= 60) {
      label = "Strong";
      color = "text-emerald-500";
      bg = "bg-emerald-500";
      percent = 80;
    } else if (entropy >= 45) {
      label = "Medium";
      color = "text-yellow-500";
      bg = "bg-yellow-500";
      percent = 55;
    } else if (entropy >= 30) {
      label = "Weak";
      color = "text-orange-500";
      bg = "bg-orange-500";
      percent = 35;
    }

    setStrength({ label, color, percent, bg });
  }, [password, length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar]);



  const howToUse = [
    { step: "Configure Settings", description: "Select the desired length and check character types you want to include." },
    { step: "Generate Password", description: "Click generate to create a secure password instantly in your browser." },
    { step: "Copy & Use", description: "Copy the password with one click. It is never sent to any server." },
  ];

  const faqs = [
    {
      question: "Is this password generator secure?",
      answer: "Yes, 100%. All generation occurs directly in your browser using the window.crypto API, which provides cryptographically strong random values. Your passwords are never transmitted over the internet."
    },
    {
      question: "What makes a password strong?",
      answer: "Password strength (entropy) increases with length and the diversity of characters. A password of 16 characters mixing lowercase, uppercase, numbers, and symbols is extremely difficult to crack."
    },
    {
      question: "What are 'similar characters'?",
      answer: "Similar characters are symbols that look alike and are easily confused in some fonts (e.g. capital 'I', lowercase 'l', number '1', or zero '0' and letter 'O'). Excluding them prevents typing errors."
    }
  ];

  const relatedTools = [
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Base64 Encoder/Decoder", href: "/base64" },
    { name: "QR Code Generator", href: "/qr-generator" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Password Security Best Practices</h3>
      <p>
        In digital security, passwords are the first line of defense. Standard brute-force and dictionary attacks can easily crack simple passwords in seconds. Utilizing long, randomized passwords stops these attacks in their tracks.
      </p>
      <h4>What is Entropy?</h4>
      <p>
        Password entropy measures how unpredictable a password is in bits. Standard guidelines recommend at least 60 bits of entropy for good protection, and 80+ bits for strong, high-security operations.
      </p>
      <ul>
        <li><strong>Entropy formula:</strong> <code>Entropy = L &times; log₂ (N)</code>, where <code>L</code> is the length and <code>N</code> is the size of the pool of possible characters.</li>
      </ul>
      <h4>How to keep your accounts safe:</h4>
      <ul>
        <li>Never reuse the same password across multiple accounts. If one service is compromised, all of your accounts become vulnerable.</li>
        <li>Use a Password Manager (like Bitwarden, 1Password, or KeePass) to store your generated credentials securely.</li>
        <li>Enable Two-Factor Authentication (2FA) wherever supported.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate cryptographically secure passwords client-side to protect your identities and accounts."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        {/* Main controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* Display box */}
          <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-3xl p-3 pl-6 pr-4 focus-within:border-primary transition-all shadow-sm scroll-mt-24">
            <input
              type="text"
              readOnly
              value={password}
              placeholder="Click generate..."
              className="w-full bg-transparent border-none outline-none font-mono text-xl sm:text-2xl font-bold py-3 pr-12 text-zinc-950 dark:text-zinc-50"
            />
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={generatePassword}
                className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 hover:text-zinc-900"
                title="Regenerate"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <CopyButton
                value={password}
                className="w-12 h-12 shadow-md animate-in fade-in"
                size="icon"
                title="Copy Password"
              />
            </div>
          </div>

          {/* Password strength bar */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl space-y-3 border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="h-4 w-4" /> Password Strength:</span>
              <span className={`${strength.color}`}>{strength.label}</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strength.bg}`} style={{ width: `${strength.percent}%` }} />
            </div>
          </div>

          {/* Customizations */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between font-bold text-sm text-muted-foreground">
                <span>PASSWORD LENGTH</span>
                <span className="text-primary font-mono text-lg">{length} Characters</span>
              </div>
              <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-mono text-xs text-muted-foreground">4</span>
                <Slider
                  value={[length]}
                  onValueChange={(val) => setLength(Array.isArray(val) ? val[0] : val)}
                  min={4}
                  max={64}
                  step={1}
                  className="flex-grow py-4"
                />
                <span className="font-mono text-xs text-muted-foreground">64</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-sm">Uppercase Letters</div>
                  <div className="text-xs text-muted-foreground">A-Z characters</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-sm">Lowercase Letters</div>
                  <div className="text-xs text-muted-foreground">a-z characters</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-sm">Numbers</div>
                  <div className="text-xs text-muted-foreground">0-9 digits</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-sm">Symbols</div>
                  <div className="text-xs text-muted-foreground">Special characters</div>
                </div>
              </label>

              <label className="sm:col-span-2 flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary"
                />
                <div className="text-left">
                  <div className="font-bold text-sm">Exclude Similar Characters</div>
                  <div className="text-xs text-muted-foreground">Avoids confusable letters like (1, l, I, 0, O)</div>
                </div>
              </label>
            </div>

            <Button
              type="button"
              onClick={() => copyShareUrl({
                length,
                upper: includeUpper ? "true" : "false",
                lower: includeLower ? "true" : "false",
                numbers: includeNumbers ? "true" : "false",
                symbols: includeSymbols ? "true" : "false",
                excludeSimilar: excludeSimilar ? "true" : undefined,
              }, "Password Preset")}
              variant="outline"
              size="sm"
              className="w-full rounded-2xl border-2 font-bold h-12 text-primary border-primary/30 hover:bg-primary/5"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share Password Preset URL
            </Button>
          </div>
        </div>

        {/* History column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 rounded-3xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-3">
              <List className="h-5 w-5 text-primary" /> Session History
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Passwords generated in this session will appear here.</p>
            ) : (
              <div className="space-y-3">
                {history.map((pw, index) => (
                  <div key={index} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-right-3 duration-200">
                    <span className="font-mono text-xs select-all truncate max-w-[150px]">{pw}</span>
                    <CopyButton
                      value={pw}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-zinc-100"
                      title="Copy Password"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-2">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-[10px] text-muted-foreground leading-normal">
                History is stored transiently in local component memory and will reset if you refresh or leave the page.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
