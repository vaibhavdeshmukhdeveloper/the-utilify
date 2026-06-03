"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Copy, 
  Trash2, 
  Check, 
  Upload, 
  Download, 
  Sparkles, 
  Plus, 
  Minus, 
  AlertCircle,
  ChevronRight,
  ChevronDown,
  RefreshCw
} from "lucide-react";

// Recursive Collapsible Tree View Component
function JsonTreeNode({ 
  label, 
  value, 
  isLast = true, 
  depth = 0 
}: { 
  label?: string; 
  value: any; 
  isLast?: boolean; 
  depth?: number; 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const type = typeof value;
  const isNull = value === null;
  const isArray = Array.isArray(value);
  const isObject = !isNull && type === "object" && !isArray;

  const indentStyle = { paddingLeft: `${depth * 16}px` };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-1 select-none">
        "{label}":
      </span>
    );
  };

  const renderComma = () => {
    if (isLast) return null;
    return <span className="text-zinc-500 mr-1 font-mono">,</span>;
  };

  if (isNull) {
    return (
      <div style={indentStyle} className="font-mono text-sm leading-6">
        {renderLabel()}
        <span className="text-rose-500 dark:text-rose-400 font-medium italic">null</span>
        {renderComma()}
      </div>
    );
  }

  if (isArray) {
    const isEmpty = value.length === 0;
    if (isEmpty) {
      return (
        <div style={indentStyle} className="font-mono text-sm leading-6">
          {renderLabel()}
          <span className="text-zinc-500">[ ]</span>
          {renderComma()}
        </div>
      );
    }

    return (
      <div style={indentStyle} className="font-mono text-sm leading-6">
        <div 
          className="flex items-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-1 -ml-1 transition-colors select-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-zinc-400 dark:text-zinc-500 mr-1 flex items-center justify-center w-3 h-3 text-xs">
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
          {renderLabel()}
          <span className="text-zinc-500 font-mono">[</span>
          {isCollapsed && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mx-1">
              {value.length} items
            </span>
          )}
          {isCollapsed && <span className="text-zinc-500 font-mono">]</span>}
          {isCollapsed && renderComma()}
        </div>
        {!isCollapsed && (
          <div>
            {value.map((item, idx) => (
              <JsonTreeNode
                key={idx}
                value={item}
                isLast={idx === value.length - 1}
                depth={depth + 1}
              />
            ))}
            <div style={{ paddingLeft: `${depth * 16}px` }} className="text-zinc-500 font-mono select-none">
              ]
              {renderComma()}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isObject) {
    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;
    if (isEmpty) {
      return (
        <div style={indentStyle} className="font-mono text-sm leading-6">
          {renderLabel()}
          <span className="text-zinc-500">{"{ }"}</span>
          {renderComma()}
        </div>
      );
    }

    return (
      <div style={indentStyle} className="font-mono text-sm leading-6">
        <div 
          className="flex items-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-1 -ml-1 transition-colors select-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-zinc-400 dark:text-zinc-500 mr-1 flex items-center justify-center w-3 h-3 text-xs">
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
          {renderLabel()}
          <span className="text-zinc-500 font-mono">{"{"}</span>
          {isCollapsed && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mx-1">
              {keys.length} keys
            </span>
          )}
          {isCollapsed && <span className="text-zinc-500 font-mono">{"}"}</span>}
          {isCollapsed && renderComma()}
        </div>
        {!isCollapsed && (
          <div>
            {keys.map((key, idx) => (
              <JsonTreeNode
                key={key}
                label={key}
                value={value[key]}
                isLast={idx === keys.length - 1}
                depth={depth + 1}
              />
            ))}
            <div style={{ paddingLeft: `${depth * 16}px` }} className="text-zinc-500 font-mono select-none">
              {"}"}
              {renderComma()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Primitive value rendering
  let valueCls = "text-emerald-600 dark:text-emerald-400"; // string
  let renderedVal = JSON.stringify(value);

  if (type === "number") {
    valueCls = "text-amber-500 dark:text-amber-400";
  } else if (type === "boolean") {
    valueCls = "text-violet-600 dark:text-violet-400 font-semibold";
  }

  return (
    <div style={indentStyle} className="font-mono text-sm leading-6">
      {renderLabel()}
      <span className={valueCls}>{renderedVal}</span>
      {renderComma()}
    </div>
  );
}

// Regex JSON Syntax Highlighter
const highlightJsonHTML = (json: string): string => {
  if (!json) return "";
  
  // Escape HTML tags to prevent injections and keep pre formatting
  const html = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Regex matches keys, strings, numbers, booleans, and nulls
  return html.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-500 dark:text-amber-400"; // default: number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-indigo-600 dark:text-indigo-400 font-semibold"; // JSON key
        } else {
          cls = "text-emerald-600 dark:text-emerald-400"; // string value
        }
      } else if (/true|false/.test(match)) {
        cls = "text-violet-600 dark:text-violet-400 font-medium"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-rose-500 dark:text-rose-400 italic font-mono"; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

const SAMPLE_JSON = `{
  "projectName": "Utilify",
  "version": "1.2.0",
  "active": true,
  "stats": {
    "users": 15400,
    "uptimePercent": 99.98,
    "launched": 2026
  },
  "features": [
    "JSON Formatter & Pretty Printer",
    "Real-time Syntax Validation",
    "Interactive Tree Viewer",
    "One-click Size Statistics",
    "File Loading & Download Support"
  ],
  "supportedFormats": [".json", ".txt"],
  "developerContact": null
}`;

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"pretty" | "tree" | "minified">("pretty");
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [parsedJson, setParsedJson] = useState<any>(null);
  
  // Validation Error state
  const [validationError, setValidationError] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);

  // Sync scroll references
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputGutterRef = useRef<HTMLDivElement>(null);
  const outputPreRef = useRef<HTMLPreElement>(null);
  const outputGutterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputScroll = () => {
    if (inputTextAreaRef.current && inputGutterRef.current) {
      inputGutterRef.current.scrollTop = inputTextAreaRef.current.scrollTop;
    }
  };

  const handleOutputScroll = () => {
    if (outputPreRef.current && outputGutterRef.current) {
      outputGutterRef.current.scrollTop = outputPreRef.current.scrollTop;
    }
  };

  // Live syntax check with debounce
  useEffect(() => {
    if (!input.trim()) {
      setValidationError(null);
      setOutput("");
      setParsedJson(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        setParsedJson(parsed);
        setValidationError(null);
        
        // Auto format output when input is valid
        if (activeTab === "minified") {
          setOutput(JSON.stringify(parsed));
        } else {
          setOutput(JSON.stringify(parsed, null, 2));
        }
      } catch (err: any) {
        // Parse error locations
        const message = err.message || "Invalid JSON syntax";
        let line: number | undefined;
        let column: number | undefined;
        
        const posMatch = message.match(/at position (\d+)/i);
        if (posMatch) {
          const position = parseInt(posMatch[1], 10);
          const linesUpToPos = input.slice(0, position).split("\n");
          line = linesUpToPos.length;
          column = linesUpToPos[linesUpToPos.length - 1].length + 1;
        }
        
        setValidationError({ message, line, column });
        // Don't wipe output entirely, but flag issues
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [input, activeTab]);

  // Adjust font sizes
  const zoomIn = () => setFontSize(prev => Math.min(20, prev + 1));
  const zoomOut = () => setFontSize(prev => Math.max(12, prev - 1));

  // Dynamic gutter width calculator based on character length and zoom size
  const getGutterWidth = (lines: number) => {
    const charCount = String(lines).length;
    return Math.max(40, charCount * fontSize * 0.6 + 16);
  };

  // Sync scrollbar heights on changes
  useEffect(() => {
    handleInputScroll();
  }, [input]);

  useEffect(() => {
    handleOutputScroll();
  }, [output, activeTab]);

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setValidationError(null);
    try {
      const parsed = JSON.parse(SAMPLE_JSON);
      setParsedJson(parsed);
      setOutput(JSON.stringify(parsed, null, 2));
      toast.success("Loaded Demo JSON successfully!");
    } catch {
      // should never happen
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      toast.success(`Loaded file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const downloadJsonFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab === "minified" ? "minified.json" : "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded JSON file!");
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setParsedJson(null);
    setValidationError(null);
    toast.success("Editor cleared");
  };

  // Helper size converter
  const getByteSizeStr = (str: string) => {
    if (!str) return "0 B";
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  // Recursive count keys/items
  const getJsonStats = (obj: any) => {
    let keys = 0;
    let items = 0;
    const count = (val: any) => {
      if (val === null || typeof val !== "object") return;
      if (Array.isArray(val)) {
        items += val.length;
        val.forEach(count);
      } else {
        const objKeys = Object.keys(val);
        keys += objKeys.length;
        objKeys.forEach(k => count(val[k]));
      }
    };
    count(obj);
    return { keys, items };
  };

  const inputLines = input.split("\n");
  const inputLineCount = Math.max(1, inputLines.length);

  const outputLines = output.split("\n");
  const outputLineCount = Math.max(1, outputLines.length);

  const stats = parsedJson ? getJsonStats(parsedJson) : { keys: 0, items: 0 };

  const howToUse = [
    { step: "Paste/Load JSON", description: "Paste your raw text, click 'Load Sample' to test, or upload a .json file." },
    { step: "Validate & Format", description: "Check real-time error details. Format will prettier-print instantly on valid entries." },
    { step: "Explore & Save", description: "Navigate using the interactive collapsible tree, copy code, or download your files." },
  ];

  const faqs = [
    { 
      question: "Is my JSON data sent to a server for formatting?", 
      answer: "No. Security is built into the architecture. All validation, syntax formatting, minification, and tree mapping are executed 100% locally inside your web browser using client-side JavaScript. No data ever leaves your device." 
    },
    { 
      question: "What does the Tree Viewer tab do?", 
      answer: "The Tree Viewer parses the JSON structure into an interactive collapsible UI. You can click arrows to expand or collapse nested objects and arrays, making it easy to navigate heavy API outputs." 
    },
    { 
      question: "How does the syntax validator show errors?", 
      answer: "If the input string violates JSON specification rules, the live parser flags the error and displays a warning banner indicating the exact line number, column index, and character issue." 
    },
    {
      question: "Can I load files directly?",
      answer: "Yes. Click the 'Upload' button in the toolbar to load files ending in '.json' or '.txt' directly from your local folders."
    },
    {
      question: "What formats can I save my formatted results in?",
      answer: "You can click the 'Copy' button to copy the output to your clipboard, or click 'Save' to download a clean, formatted '.json' file directly."
    },
    {
      question: "What are the common syntax mistakes caught by the validator?",
      answer: "Our validator detects typical JSON formatting errors such as trailing commas after the last item, single quotes instead of double quotes, missing quotes around keys, or unmatched braces and brackets."
    }
  ];

  const relatedTools = [
    { name: "Markdown to PDF", href: "/markdown-to-pdf" },
    { name: "Image Compressor", href: "/image-compressor" },
    { name: "PDF to Image", href: "/pdf-to-image" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: JSON Validation and Formatting</h3>
      <p>
        JSON (JavaScript Object Notation) is the standard exchange format for modern web APIs. However, raw JSON files are often minified to reduce network payloads, which removes all indentation and whitespace, making it impossible for humans to scan. Prettifying JSON restores indentation and spacing for quick debugging.
      </p>
      <h4>Standard JSON Rules Checked by Our Validator</h4>
      <p>
        JSON has strict formatting rules that differ from standard JavaScript objects. Our real-time validator helps you identify and fix these rules:
      </p>
      <ul>
        <li><strong>Double Quotes Only:</strong> All keys and string values must be enclosed in double quotes (<code>"key"</code>). Single quotes (<code>'key'</code>) are invalid.</li>
        <li><strong>No Trailing Commas:</strong> There must be no comma after the last key-value pair in an object or the last item in an array.</li>
        <li><strong>Braces Match:</strong> All curly braces <code>{"{ }"}</code> and square brackets <code>[ ]</code> must balance and nest correctly.</li>
      </ul>
      <h4>Minifying vs. Prettifying JSON</h4>
      <p>
        Use the tabs in the output panel to toggle views based on your needs:
      </p>
      <ul>
        <li><strong>Pretty:</strong> Formats the JSON with indentation and colors, making it highly readable for debugging and developer inspection.</li>
        <li><strong>Tree View:</strong> Renders an interactive collapsible view, useful when dealing with very large datasets.</li>
        <li><strong>Minified:</strong> Compresses the JSON onto a single line and removes all whitespace, reducing file size for optimized API payloads.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Pretty-print, validate, and minify your JSON data instantly. 100% private and secure."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full space-y-6">
        
        {/* Real-time Validation Warning Banner at the top for maximum visibility */}
        {validationError && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-left animate-in fade-in slide-in-from-bottom-2 duration-250">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-800 dark:text-rose-400 text-sm">JSON Syntax Error</h4>
              <p className="text-xs text-rose-600 dark:text-rose-400/80 mt-0.5">{validationError.message}</p>
              {(validationError.line || validationError.column) && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-semibold select-none">
                  Line {validationError.line}, Column {validationError.column}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Editor Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[600px]">
          
          {/* LEFT PANEL - Raw Input */}
          <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 border rounded-xl overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
            
            {/* Input Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b gap-2">
              <div className="flex items-center gap-2 select-none">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  INPUT JSON
                </span>
                {validationError && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 dark:bg-rose-950/40 text-rose-600 animate-pulse border border-rose-200 dark:border-rose-900/30">
                    Syntax Error
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".json,.txt"
                  className="hidden" 
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-8 text-xs gap-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadSample} 
                  className="h-8 text-xs gap-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Load Sample
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll} 
                  className="h-8 text-xs gap-1 hover:bg-rose-100 dark:hover:bg-rose-950/30 text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            </div>

            {/* Input Textarea with synched gutter */}
            <div className="flex flex-1 relative overflow-hidden h-[450px]">
              {/* Synched line number gutter */}
              <div 
                ref={inputGutterRef}
                className="bg-zinc-100/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 py-3 select-none overflow-hidden flex flex-col items-end text-zinc-400 font-mono text-xs pr-2 shrink-0"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: "24px",
                  width: `${getGutterWidth(inputLineCount)}px`
                }}
              >
                {Array.from({ length: inputLineCount }).map((_, i) => {
                  const isErrorLine = validationError && validationError.line === i + 1;
                  return (
                    <div 
                      key={i} 
                      className={isErrorLine ? "text-rose-500 font-bold bg-rose-500/10 dark:bg-rose-500/20 w-full text-right pr-2" : ""}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              
              {/* Textarea */}
              <textarea
                ref={inputTextAreaRef}
                onScroll={handleInputScroll}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your raw JSON code here..."
                className="flex-1 p-3 m-0 bg-transparent font-mono text-sm leading-6 resize-none outline-none border-0 overflow-auto whitespace-pre text-left text-zinc-900 dark:text-zinc-100"
                style={{ fontSize: `${fontSize}px`, lineHeight: "24px" }}
              />
            </div>

            {/* Input Info Bar */}
            <div className="px-4 py-2 border-t bg-zinc-100/40 dark:bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-500 font-mono select-none">
              <span>Lines: {input.trim() ? inputLineCount : 0}</span>
              <span>Size: {getByteSizeStr(input)}</span>
            </div>
          </div>

          {/* RIGHT PANEL - Output Viewer */}
          <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 border rounded-xl overflow-hidden shadow-sm transition-all">
            
            {/* Output Header Tabs & Actions */}
            <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border-b gap-2">
              
              {/* Custom View Tabs */}
              <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded-lg p-0.5 select-none">
                <button
                  onClick={() => setActiveTab("pretty")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "pretty" 
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  Pretty
                </button>
                <button
                  onClick={() => setActiveTab("tree")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "tree" 
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  Tree View
                </button>
                <button
                  onClick={() => {
                    setActiveTab("minified");
                    if (parsedJson) {
                      setOutput(JSON.stringify(parsedJson));
                    }
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "minified" 
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  Minified
                </button>
              </div>

              {/* Toolbar Right Side */}
              <div className="flex items-center gap-1">
                {/* Font Scaling */}
                <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-md bg-background overflow-hidden mr-1 select-none">
                  <button 
                    onClick={zoomOut} 
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 border-r border-zinc-200 dark:border-zinc-800"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={zoomIn} 
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={!output}
                  onClick={downloadJsonFile} 
                  className="h-8 text-xs gap-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Download className="h-3.5 w-3.5" /> Save
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={!output}
                  onClick={copyToClipboard} 
                  className="h-8 text-xs gap-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Output Panels */}
            <div className="flex flex-1 relative overflow-hidden h-[450px]">
              
              {/* Output Content */}
              {activeTab === "tree" ? (
                // Tree viewer
                <div className="flex-grow p-4 overflow-auto text-left bg-zinc-50/50 dark:bg-zinc-950/50">
                  {parsedJson ? (
                    <JsonTreeNode value={parsedJson} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-zinc-400 select-none">
                      Valid formatted JSON Tree will appear here...
                    </div>
                  )}
                </div>
              ) : (
                // Text code blocks with synched gutters
                <div className="flex flex-1 relative overflow-hidden">
                  
                  {/* Synched line gutter */}
                  <div 
                    ref={outputGutterRef}
                    className="bg-zinc-100/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 py-3 select-none overflow-hidden flex flex-col items-end text-zinc-400 font-mono text-xs pr-2 shrink-0"
                    style={{ 
                      fontSize: `${fontSize}px`, 
                      lineHeight: "24px",
                      width: `${getGutterWidth(outputLineCount)}px`
                    }}
                  >
                    {Array.from({ length: output ? outputLineCount : 1 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Highlighted pretty or standard minified code */}
                  <pre
                    ref={outputPreRef}
                    onScroll={handleOutputScroll}
                    className="flex-grow p-3 m-0 font-mono text-sm leading-6 overflow-auto text-left select-text whitespace-pre bg-transparent scrollbar-thin text-zinc-800 dark:text-zinc-200"
                    style={{ fontSize: `${fontSize}px`, lineHeight: "24px" }}
                  >
                    {output ? (
                      activeTab === "pretty" ? (
                        <code 
                          dangerouslySetInnerHTML={{ 
                            __html: highlightJsonHTML(output) 
                          }} 
                        />
                      ) : (
                        <code>{output}</code>
                      )
                    ) : (
                      <code className={validationError ? "text-rose-500/70 dark:text-rose-400/70 select-none" : "text-zinc-400 select-none"}>
                        {validationError ? (
                          <span className="flex items-center gap-1.5 font-sans">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            Fix syntax error on the left to format...
                          </span>
                        ) : (
                          "Formatted JSON will appear here..."
                        )}
                      </code>
                    )}
                  </pre>
                </div>
              )}
            </div>

            {/* Output Info Bar */}
            <div className="px-4 py-2 border-t bg-zinc-100/40 dark:bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-500 font-mono select-none">
              <span>Lines: {output ? outputLineCount : 0}</span>
              <div className="flex items-center gap-4">
                {parsedJson && (
                  <>
                    <span>Keys: {stats.keys}</span>
                    <span>Items: {stats.items}</span>
                  </>
                )}
                <span>Size: {getByteSizeStr(output)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
