"use client";

import { ToolCard } from "@/components/ToolCard";
import { 
  FileJson, 
  FileText, 
  SplitSquareVertical, 
  Merge, 
  Image as ImageIcon, 
  Layers, 
  Calculator,
  TrendingUp,
  PiggyBank
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const allTools = [
  {
    title: "JSON Formatter",
    description: "Pretty-print, validate and minify JSON data instantly.",
    href: "/json-formatter",
    icon: FileJson,
    category: "Developer"
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) instantly.",
    href: "/bmi-calculator",
    icon: Calculator,
    category: "Health"
  },
  {
    title: "Investment Calculator",
    description: "Project your future wealth with compound interest.",
    href: "/investment-calculator",
    icon: TrendingUp,
    category: "Finance"
  },
  {
    title: "SIP Calculator",
    description: "Estimate the future value of your monthly investments.",
    href: "/sip-calculator",
    icon: PiggyBank,
    category: "Finance"
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages into high-quality JPG or PNG images.",
    href: "/pdf-to-image",
    icon: FileText,
    category: "PDF",
    popular: true
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole range for easy conversion.",
    href: "/split-pdf",
    icon: SplitSquareVertical,
    category: "PDF"
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into a single document.",
    href: "/merge-pdf",
    icon: Merge,
    category: "PDF"
  },
  {
    title: "Background Remover",
    description: "Remove image backgrounds automatically using AI.",
    href: "/background-remover",
    icon: Layers,
    category: "Image",
    popular: true
  },
  {
    title: "Image Compressor",
    description: "Reduce image file size without losing quality.",
    href: "/image-compressor",
    icon: ImageIcon,
    category: "Image"
  },
  {
    title: "Markdown to PDF",
    description: "Convert Markdown text or files into clean PDF documents.",
    href: "/markdown-to-pdf",
    icon: FileText,
    category: "Developer"
  }
];

export function ToolsGrid() {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", "PDF", "Image", "Developer", "Finance", "Health"];
  
  const filteredTools = filter === "All" 
    ? allTools 
    : allTools.filter(t => t.category === filter);

  return (
    <section id="tools" className="py-24">
      <div className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tight mb-4">Our Powerful Tools</h2>
            <p className="text-xl text-muted-foreground">Select a tool to get started with your task.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
            {categories.map((cat) => (
              <Button 
                key={cat}
                variant={filter === cat ? "default" : "ghost"} 
                size="sm"
                onClick={() => setFilter(cat)}
                className="rounded-xl px-6 font-bold"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
