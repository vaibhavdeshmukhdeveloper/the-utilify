"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Link as LinkIcon, FileText, Wifi, Mail, MessageSquare, Palette, Sliders, RefreshCw, QrCode, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { copyShareUrl } from "@/lib/share-utils";

export default function QrGeneratorClient() {
  const [activeTab, setActiveTab] = useState("url");
  
  // Input states
  const [url, setUrl] = useState("https://www.theutilify.com");
  const [text, setText] = useState("Hello from Utilify!");
  const [wifiSsid, setWifiSsid] = useState("MyHomeNetwork");
  const [wifiPassword, setWifiPassword] = useState("SuperSecretPassword");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [emailTo, setEmailTo] = useState("hello@example.com");
  const [emailSubject, setEmailSubject] = useState("Hello");
  const [emailBody, setEmailBody] = useState("Just scanning this QR code!");
  const [smsPhone, setSmsPhone] = useState("+1234567890");
  const [smsMessage, setSmsMessage] = useState("Hello there!");

  // Styling states
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parse deep link query parameters on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const type = params.get("type") || params.get("tab");
        const u = params.get("url");
        const t = params.get("text");
        const ssid = params.get("ssid");
        const pass = params.get("password");
        const email = params.get("email");
        const phone = params.get("phone");
        const fg = params.get("fg");
        const bg = params.get("bg");

        if (type && ["url", "text", "wifi", "email", "sms"].includes(type)) {
          setActiveTab(type);
        }
        if (u) setUrl(u);
        if (t) setText(t);
        if (ssid) setWifiSsid(ssid);
        if (pass) setWifiPassword(pass);
        if (email) setEmailTo(email);
        if (phone) setSmsPhone(phone);
        if (fg) setFgColor(fg.startsWith("#") ? fg : `#${fg}`);
        if (bg) setBgColor(bg.startsWith("#") ? bg : `#${bg}`);
      }
    } catch (e) {
      console.error("Error parsing QR params", e);
    }
  }, []);

  // Generate the formatted QR code data string
  const getQrData = () => {
    switch (activeTab) {
      case "url":
        return url.trim() || "https://www.theutilify.com";
      case "text":
        return text || " ";
      case "wifi":
        // Format: WIFI:S:SSID;T:WPA;P:PASSWORD;;
        return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "sms":
        return `smsto:${smsPhone}:${smsMessage}`;
      default:
        return "https://www.theutilify.com";
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        getQrData(),
        {
          width: 320,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        },
        (err) => {
          if (err) {
            console.error(err);
            toast.error("Failed to render QR Code");
          }
        }
      );
    }
  }, [activeTab, url, text, wifiSsid, wifiPassword, wifiSecurity, emailTo, emailSubject, emailBody, smsPhone, smsMessage, fgColor, bgColor, margin, errorCorrection]);

  const downloadQr = () => {
    if (!canvasRef.current) return;
    try {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `utilify-qrcode-${activeTab}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("QR Code downloaded successfully");
    } catch {
      toast.error("Failed to download QR Code");
    }
  };

  const resetSettings = () => {
    setFgColor("#000000");
    setBgColor("#ffffff");
    setMargin(4);
    setErrorCorrection("M");
    toast.success("Design settings reset");
  };

  const howToUse = [
    { step: "Choose Content Type", description: "Select between URL, Text, Wi-Fi, Email, or SMS tabs based on what you want to share." },
    { step: "Fill Details & Style", description: "Enter your information and customize the colors or margin of your QR code." },
    { step: "Download QR", description: "Click the download button to save your custom QR code as a high-quality PNG image." },
  ];

  const faqs = [
    {
      question: "Are these QR codes safe to use?",
      answer: "Absolutely. All QR encoding and image rendering takes place right inside your browser. No contents or inputs are sent to our servers, keeping your contact details, Wi-Fi passwords, and links 100% confidential."
    },
    {
      question: "Which Error Correction level should I choose?",
      answer: "Error correction helps the QR code remain readable even if it is partially damaged or dirty. 'Low' (L) is fine for digital screens, 'Medium' (M) is good for standard use, and 'High' (H) is recommended for printing on physical items like shirts or brochures."
    },
    {
      question: "How do I connect to a Wi-Fi network using a QR code?",
      answer: "Most modern smartphones running iOS or Android can scan the Wi-Fi QR code with their default camera app. When scanned, it will prompt you with a card to automatically connect to the network without typing the password."
    }
  ];

  const relatedTools = [
    { name: "Base64 Encoder/Decoder", href: "/base64" },
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Password Generator", href: "/password-generator" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: How QR Codes Work</h3>
      <p>
        Quick Response (QR) codes are two-dimensional barcodes invented in 1994 by the Japanese automotive company Denso Wave. Unlike standard vertical barcodes that only read horizontally, QR codes encode data in both vertical and horizontal directions, storing significantly more information.
      </p>
      <h4>Data Structuring Formats:</h4>
      <ul>
        <li><strong>URLs:</strong> Standard raw string headers (e.g. <code>https://...</code>). Browsers handle them as direct redirects.</li>
        <li><strong>Wi-Fi Networks:</strong> Uses the industry standard <code>WIFI:S:&lt;SSID&gt;;T:&lt;WEP|WPA|nopass&gt;;P:&lt;PASSWORD&gt;;;</code> structure.</li>
        <li><strong>Mailto Actions:</strong> Uses the standard protocol <code>mailto:&lt;email&gt;?subject=&lt;subject&gt;&amp;body=&lt;body&gt;</code> to open the client's email application.</li>
      </ul>
      <h4>Contrast Best Practices:</h4>
      <p>
        Always ensure there is high contrast between the foreground (dark dots) and background colors. If contrast is too low, QR scanners will fail to separate the patterns. Black on a white background is the most readable combination.
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create beautiful, customizable QR codes instantly for Wi-Fi, links, email contacts, and more."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-8">
          <Tabs defaultValue="url" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 h-12 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900">
              <TabsTrigger value="url" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">URL</span></TabsTrigger>
              <TabsTrigger value="text" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"><FileText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Text</span></TabsTrigger>
              <TabsTrigger value="wifi" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"><Wifi className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Wi-Fi</span></TabsTrigger>
              <TabsTrigger value="email" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"><Mail className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Email</span></TabsTrigger>
              <TabsTrigger value="sms" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> <span className="hidden sm:inline">SMS</span></TabsTrigger>
            </TabsList>

            {/* URL input */}
            <TabsContent value="url" className="mt-6 space-y-4 m-0">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  className="h-12 rounded-xl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            {/* Plain Text Input */}
            <TabsContent value="text" className="mt-6 space-y-4 m-0">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Plain Text</label>
                <Textarea
                  placeholder="Type anything to encode..."
                  className="min-h-[120px] rounded-xl"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </TabsContent>

            {/* Wi-Fi Input */}
            <TabsContent value="wifi" className="mt-6 space-y-4 m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Network SSID (Name)</label>
                  <Input
                    type="text"
                    placeholder="My Wi-Fi Network"
                    className="h-12 rounded-xl"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                  <Input
                    type="text"
                    placeholder="Security Password"
                    className="h-12 rounded-xl"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Security Type</label>
                  <select
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Unsecured (No Password)</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            {/* Email Input */}
            <TabsContent value="email" className="mt-6 space-y-4 m-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">To (Email Address)</label>
                  <Input
                    type="email"
                    placeholder="receiver@example.com"
                    className="h-12 rounded-xl"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                  <Input
                    type="text"
                    placeholder="Contact Request"
                    className="h-12 rounded-xl"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Message Body</label>
                  <Textarea
                    placeholder="Type message text here..."
                    className="min-h-[100px] rounded-xl"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* SMS Input */}
            <TabsContent value="sms" className="mt-6 space-y-4 m-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+1 555 123 4567"
                    className="h-12 rounded-xl"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Message</label>
                  <Textarea
                    placeholder="Type SMS text here..."
                    className="min-h-[100px] rounded-xl"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Design Controls */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-md font-bold flex items-center gap-2 border-b pb-3">
              <Sliders className="h-5 w-5 text-primary" /> Customize Styling
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Foreground Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-12 p-1 rounded-xl cursor-pointer border-2"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                  <Input
                    type="text"
                    className="h-12 rounded-xl font-mono uppercase"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Background Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-12 p-1 rounded-xl cursor-pointer border-2"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <Input
                    type="text"
                    className="h-12 rounded-xl font-mono uppercase"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quiet Zone (Margin)</label>
                <select
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                >
                  <option value={1}>Compact (1x)</option>
                  <option value={2}>Small (2x)</option>
                  <option value={4}>Standard (4x)</option>
                  <option value={6}>Large (6x)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Error Correction Level</label>
                <select
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={resetSettings} className="text-muted-foreground hover:text-primary font-bold">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reset styling
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 flex flex-col items-center scroll-mt-24">
          <Card className="w-full p-8 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-md">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 self-start border-b pb-3 w-full">
              <QrCode className="h-5 w-5 text-primary" /> QR Code Preview
            </h3>
            
            {/* The QR Canvas wrapper */}
            <div className="p-4 bg-white rounded-3xl border shadow-inner max-w-full overflow-hidden">
              <canvas ref={canvasRef} className="mx-auto rounded-xl max-w-full" style={{ width: "260px", height: "260px" }} />
            </div>

            <div className="w-full mt-8 space-y-3">
              <Button onClick={downloadQr} className="w-full h-12 rounded-xl shadow-md font-bold flex items-center justify-center gap-2">
                <Download className="h-5 w-5" /> Download QR Image
              </Button>
              <Button
                type="button"
                onClick={() => copyShareUrl({
                  type: activeTab,
                  url: activeTab === "url" ? url : undefined,
                  text: activeTab === "text" ? text : undefined,
                  ssid: activeTab === "wifi" ? wifiSsid : undefined,
                  email: activeTab === "email" ? emailTo : undefined,
                  phone: activeTab === "sms" ? smsPhone : undefined,
                  fg: fgColor !== "#000000" ? fgColor.replace("#", "") : undefined,
                  bg: bgColor !== "#ffffff" ? bgColor.replace("#", "") : undefined,
                }, "QR Code Preset")}
                variant="outline"
                className="w-full h-11 rounded-xl border-2 font-bold text-primary border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" /> Share QR Preset Link
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
