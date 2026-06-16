"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Ruler, Scale, Thermometer, Box, Layers, ArrowLeftRight, Info } from "lucide-react";

type UnitType = "length" | "weight" | "temperature" | "area" | "volume";

interface Unit {
  value: string;
  label: string;
  factor: number; // reference multiplier (relative to base unit)
}

const unitsConfig: Record<UnitType, { base: string; list: Unit[] }> = {
  length: {
    base: "m",
    list: [
      { value: "mm", label: "Millimeters (mm)", factor: 0.001 },
      { value: "cm", label: "Centimeters (cm)", factor: 0.01 },
      { value: "m", label: "Meters (m)", factor: 1 },
      { value: "km", label: "Kilometers (km)", factor: 1000 },
      { value: "in", label: "Inches (in)", factor: 0.0254 },
      { value: "ft", label: "Feet (ft)", factor: 0.3048 },
      { value: "yd", label: "Yards (yd)", factor: 0.9144 },
      { value: "mi", label: "Miles (mi)", factor: 1609.344 },
    ],
  },
  weight: {
    base: "kg",
    list: [
      { value: "mg", label: "Milligrams (mg)", factor: 0.000001 },
      { value: "g", label: "Grams (g)", factor: 0.001 },
      { value: "kg", label: "Kilograms (kg)", factor: 1 },
      { value: "lbs", label: "Pounds (lbs)", factor: 0.45359237 },
      { value: "oz", label: "Ounces (oz)", factor: 0.028349523 },
      { value: "ton", label: "Metric Tons (t)", factor: 1000 },
    ],
  },
  temperature: {
    base: "c",
    list: [
      { value: "c", label: "Celsius (°C)", factor: 1 },
      { value: "f", label: "Fahrenheit (°F)", factor: 1 },
      { value: "k", label: "Kelvin (K)", factor: 1 },
    ],
  },
  area: {
    base: "m2",
    list: [
      { value: "cm2", label: "Square Centimeters (cm²)", factor: 0.0001 },
      { value: "m2", label: "Square Meters (m²)", factor: 1 },
      { value: "km2", label: "Square Kilometers (km²)", factor: 1000000 },
      { value: "in2", label: "Square Inches (in²)", factor: 0.00064516 },
      { value: "ft2", label: "Square Feet (ft²)", factor: 0.09290304 },
      { value: "ac", label: "Acres (ac)", factor: 4046.8564 },
      { value: "ha", label: "Hectares (ha)", factor: 10000 },
    ],
  },
  volume: {
    base: "l",
    list: [
      { value: "ml", label: "Milliliters (ml)", factor: 0.001 },
      { value: "l", label: "Liters (L)", factor: 1 },
      { value: "m3", label: "Cubic Meters (m³)", factor: 1000 },
      { value: "fl_oz", label: "Fluid Ounces (fl oz)", factor: 0.029573529 },
      { value: "cup", label: "Cups", factor: 0.236588236 },
      { value: "pt", label: "Pints (pt)", factor: 0.473176473 },
      { value: "qt", label: "Quarts (qt)", factor: 0.946352946 },
      { value: "gal", label: "Gallons (gal)", factor: 3.78541178 },
    ],
  },
};

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitType>("length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [resultValue, setResultValue] = useState("");
  const [allConversions, setAllConversions] = useState<{ label: string; value: string }[]>([]);

  // Update default units on category change
  useEffect(() => {
    const config = unitsConfig[category];
    setFromUnit(config.list[2]?.value || config.list[0].value);
    setToUnit(config.list[3]?.value || config.list[1].value);
  }, [category]);

  const performConversion = (valStr: string, from: string, to: string, cat: UnitType) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) {
      setResultValue("");
      setAllConversions([]);
      return;
    }

    const config = unitsConfig[cat];
    let result = 0;

    if (cat === "temperature") {
      // Special offset math for temp
      if (from === to) {
        result = val;
      } else if (from === "c" && to === "f") {
        result = val * 1.8 + 32;
      } else if (from === "c" && to === "k") {
        result = val + 273.15;
      } else if (from === "f" && to === "c") {
        result = (val - 32) / 1.8;
      } else if (from === "f" && to === "k") {
        result = (val - 32) / 1.8 + 273.15;
      } else if (from === "k" && to === "c") {
        result = val - 273.15;
      } else if (from === "k" && to === "f") {
        result = (val - 273.15) * 1.8 + 32;
      }
    } else {
      // General multiplicative factor conversion
      const fromObj = config.list.find((u) => u.value === from);
      const toObj = config.list.find((u) => u.value === to);
      if (fromObj && toObj) {
        const valInBase = val * fromObj.factor;
        result = valInBase / toObj.factor;
      }
    }

    // Format output cleanly
    setResultValue(
      result % 1 === 0 ? result.toString() : parseFloat(result.toFixed(6)).toString()
    );

    // Calculate full breakdown conversions for the input
    const breakdown = config.list.map((unit) => {
      let unitRes = 0;
      if (cat === "temperature") {
        if (from === unit.value) {
          unitRes = val;
        } else if (from === "c" && unit.value === "f") {
          unitRes = val * 1.8 + 32;
        } else if (from === "c" && unit.value === "k") {
          unitRes = val + 273.15;
        } else if (from === "f" && unit.value === "c") {
          unitRes = (val - 32) / 1.8;
        } else if (from === "f" && unit.value === "k") {
          unitRes = (val - 32) / 1.8 + 273.15;
        } else if (from === "k" && unit.value === "c") {
          unitRes = val - 273.15;
        } else if (from === "k" && unit.value === "f") {
          unitRes = (val - 273.15) * 1.8 + 32;
        }
      } else {
        const fromObj = config.list.find((u) => u.value === from);
        if (fromObj) {
          unitRes = (val * fromObj.factor) / unit.factor;
        }
      }

      return {
        label: unit.label,
        value: unitRes % 1 === 0 ? unitRes.toString() : parseFloat(unitRes.toFixed(6)).toString(),
      };
    });

    setAllConversions(breakdown);
  };

  useEffect(() => {
    performConversion(inputValue, fromUnit, toUnit, category);
  }, [inputValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    toast.success("Units swapped");
  };

  const howToUse = [
    { step: "Choose Measurement Category", description: "Select the metric category you wish to convert (Length, Weight, Temp, Area, Volume)." },
    { step: "Select Units & Value", description: "Select the source and destination units and input the value you want to translate." },
    { step: "Inspect Conversion Grid", description: "View the converted result instantly. Explore the full unit breakdown table below." },
  ];

  const faqs = [
    {
      question: "Are these conversions exact?",
      answer: "We use standard scientific multipliers. Temperature mappings use absolute standard scale algorithms, and length/weight use conversion standards defined by international weight and measurement bureaus."
    },
    {
      question: "Why does temperature not use multiplication factors?",
      answer: "Unlike length or weight, temperature scales do not share a common zero point. Celsius, Fahrenheit, and Kelvin have different offsets, which require add/subtract calculations combined with multiplication ratios."
    },
    {
      question: "Does this require internet connectivity?",
      answer: "No. All conversion computations run entirely client-side using JavaScript. It is offline-first, secure, and fast."
    }
  ];

  const relatedTools = [
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "Date Calculator", href: "/date-calculator" },
    { name: "SIP Calculator", href: "/sip-calculator" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Measurement Systems</h3>
      <p>
        For centuries, different societies developed localized units for trade, construction, and navigation. Modern global operations are governed by two major frameworks: the Imperial System (primarily used in the United States) and the Metric System (formalized as the International System of Units or SI).
      </p>
      <h4>The SI (Metric) Standard:</h4>
      <p>
        Formalized in France during the 1790s, the metric system is decimal-based, using base-10 modifiers (milli-, centi-, kilo-) to shift values. This simplifies calculations.
      </p>
      <h4>The US Customary (Imperial) System:</h4>
      <p>
        Inherited from British standards, custom units rely on historical definitions (e.g., a foot was traditionally associated with human dimensions). Mappings are highly irregular, requiring memory-bound conversions (e.g., 12 inches to a foot, 5,280 feet to a mile).
      </p>
    </article>
  );

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert length, weight, temperature, area, and volume measurements instantly with detailed breakdown analysis."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 text-left">
        {/* Category Switcher */}
        <div className="flex justify-center">
          <Tabs defaultValue="length" className="w-full" onValueChange={(val) => setCategory(val as UnitType)}>
            <TabsList className="grid w-full grid-cols-5 h-14 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900">
              <TabsTrigger value="length" className="text-xs font-bold rounded-xl data-[state=active]:bg-background flex items-center justify-center gap-1.5"><Ruler className="h-4 w-4" /><span className="hidden sm:inline">Length</span></TabsTrigger>
              <TabsTrigger value="weight" className="text-xs font-bold rounded-xl data-[state=active]:bg-background flex items-center justify-center gap-1.5"><Scale className="h-4 w-4" /><span className="hidden sm:inline">Weight</span></TabsTrigger>
              <TabsTrigger value="temperature" className="text-xs font-bold rounded-xl data-[state=active]:bg-background flex items-center justify-center gap-1.5"><Thermometer className="h-4 w-4" /><span className="hidden sm:inline">Temp</span></TabsTrigger>
              <TabsTrigger value="area" className="text-xs font-bold rounded-xl data-[state=active]:bg-background flex items-center justify-center gap-1.5"><Layers className="h-4 w-4" /><span className="hidden sm:inline">Area</span></TabsTrigger>
              <TabsTrigger value="volume" className="text-xs font-bold rounded-xl data-[state=active]:bg-background flex items-center justify-center gap-1.5"><Box className="h-4 w-4" /><span className="hidden sm:inline">Volume</span></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Input Cards Area */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          {/* From Unit Card */}
          <Card className="md:col-span-5 p-6 bg-zinc-50 dark:bg-zinc-900 border-none rounded-3xl space-y-4">
            <label className="text-xs font-bold text-muted-foreground uppercase">From</label>
            <Input
              type="number"
              className="h-14 text-2xl font-black rounded-xl border-2 focus:border-primary font-mono"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="1"
            />
            <select
              className="flex h-12 w-full rounded-xl border bg-background px-3 py-1 text-sm font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {unitsConfig[category].list.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </Card>

          {/* Swap icon */}
          <div className="md:col-span-1 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapUnits}
              className="w-12 h-12 rounded-full border shadow-md hover:bg-zinc-100"
            >
              <ArrowLeftRight className="h-5 w-5 rotate-90 md:rotate-0" />
            </Button>
          </div>

          {/* To Unit Card */}
          <Card className="md:col-span-5 p-6 bg-zinc-50 dark:bg-zinc-900 border-none rounded-3xl space-y-4">
            <label className="text-xs font-bold text-muted-foreground uppercase">To</label>
            <Input
              type="text"
              readOnly
              className="h-14 text-2xl font-black rounded-xl border bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-950 dark:text-zinc-50"
              value={resultValue}
              placeholder="Output value..."
            />
            <select
              className="flex h-12 w-full rounded-xl border bg-background px-3 py-1 text-sm font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {unitsConfig[category].list.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </Card>
        </div>

        {/* Breakdown table */}
        {allConversions.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">All Conversion Mappings</h3>
            <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider border-b">Target Unit</th>
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider border-b text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {allConversions.map((conv, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 border-b last:border-b-0 ${
                        toUnit === unitsConfig[category].list[idx]?.value ? "bg-primary/5 font-black text-primary" : ""
                      }`}
                    >
                      <td className="p-4 font-bold text-sm">{conv.label}</td>
                      <td className="p-4 text-right font-mono text-sm">{conv.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
