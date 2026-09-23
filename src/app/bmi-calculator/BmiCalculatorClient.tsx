"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Calculator, RefreshCw, Info, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MathFormula } from "@/components/MathFormula";
import { triggerConfetti } from "@/lib/confetti";
import { copyShareUrl } from "@/lib/share-utils";
import { getUIStrings, Locale } from "@/lib/i18n/ui-strings";

export interface BmiCalculatorClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function BmiCalculatorClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: BmiCalculatorClientProps = {}) {
  const t = getUIStrings((lang as Locale) || "en");
  const [unitSystem, setUnitSystem] = useState("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [result, setResult] = useState<{ 
    bmi: string; 
    category: string; 
    color: string; 
    healthyWeightRange?: string;
    validationMessage?: string;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Parse deep link parameters on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const unit = params.get("unit") || params.get("system");
        const w = params.get("weight") || params.get("w");
        const h = params.get("height") || params.get("h");
        const lbs = params.get("weightLbs") || params.get("lbs");
        const ft = params.get("heightFt") || params.get("ft");
        const inch = params.get("heightIn") || params.get("in");

        if (unit && (unit === "metric" || unit === "us")) {
          setUnitSystem(unit);
        }
        if (w && !isNaN(Number(w))) setWeight(w);
        if (h && !isNaN(Number(h))) setHeight(h);
        if (lbs && !isNaN(Number(lbs))) setWeightLbs(lbs);
        if (ft && !isNaN(Number(ft))) setHeightFt(ft);
        if (inch && !isNaN(Number(inch))) setHeightIn(inch);
      }
    } catch (e) {
      console.error("Error parsing BMI params", e);
    }
  }, []);

  // Run calculation reactively whenever inputs change
  useEffect(() => {
    let bmiValue = 0;
    let healthyWeightRange = "";

    if (unitSystem === "metric") {
      const w = parseFloat(weight);
      const hCm = parseFloat(height);
      const h = hCm / 100;
      
      if (!weight.trim() || !height.trim()) {
        setResult(null);
        return;
      }

      if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0) {
        setResult({
          bmi: "--",
          category: "Invalid Input",
          color: "text-amber-500",
          validationMessage: "Please enter positive numbers greater than zero for weight and height.",
        });
        return;
      }
      
      bmiValue = w / (h * h);
      const minKg = 18.5 * (h * h);
      const maxKg = 24.9 * (h * h);
      const minLbs = minKg * 2.20462;
      const maxLbs = maxKg * 2.20462;
      healthyWeightRange = `${minKg.toFixed(1)} kg – ${maxKg.toFixed(1)} kg (${minLbs.toFixed(1)} – ${maxLbs.toFixed(1)} lbs)`;
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inch;
      
      if (!weightLbs.trim() || (!heightFt.trim() && !heightIn.trim())) {
        setResult(null);
        return;
      }

      if (isNaN(lbs) || isNaN(totalInches) || lbs <= 0 || totalInches <= 0) {
        setResult({
          bmi: "--",
          category: "Invalid Input",
          color: "text-amber-500",
          validationMessage: "Please enter positive numbers greater than zero for weight and height.",
        });
        return;
      }
      // BMI formula (US): 703 * (weight / height^2)
      bmiValue = 703 * (lbs / (totalInches * totalInches));
      const minLbs = (18.5 * (totalInches * totalInches)) / 703;
      const maxLbs = (24.9 * (totalInches * totalInches)) / 703;
      const minKg = minLbs * 0.453592;
      const maxKg = maxLbs * 0.453592;
      healthyWeightRange = `${minLbs.toFixed(1)} lbs – ${maxLbs.toFixed(1)} lbs (${minKg.toFixed(1)} – ${maxKg.toFixed(1)} kg)`;
    }

    const bmiStr = bmiValue.toFixed(1);
    let category = "";
    let color = "";

    if (bmiValue < 18.5) {
      category = t.bmiCalculator.categories.underweight;
      color = "text-blue-500";
    } else if (bmiValue < 25) {
      category = t.bmiCalculator.categories.normal;
      color = "text-green-500";
    } else if (bmiValue < 30) {
      category = t.bmiCalculator.categories.overweight;
      color = "text-yellow-500";
    } else if (bmiValue < 35) {
      category = t.bmiCalculator.categories.obese1;
      color = "text-orange-500";
    } else if (bmiValue < 40) {
      category = t.bmiCalculator.categories.obese2;
      color = "text-red-500";
    } else {
      category = t.bmiCalculator.categories.obese3;
      color = "text-red-700";
    }

    setResult({ bmi: bmiStr, category, color, healthyWeightRange });
  }, [unitSystem, weight, height, weightLbs, heightFt, heightIn, t]);

  const calculateBmi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerConfetti();

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.success("BMI Calculated!");
  };

  const handleUnitSystemChange = (newSystem: string) => {
    setUnitSystem(newSystem);

    if (newSystem === "us") {
      // Convert metric to US
      const w = parseFloat(weight);
      const h = parseFloat(height);
      if (w && w > 0) {
        const lbs = w * 2.20462;
        setWeightLbs(parseFloat(lbs.toFixed(1)).toString());
      }
      if (h && h > 0) {
        const totalInches = h / 2.54;
        const ft = Math.floor(totalInches / 12);
        const inch = Math.round(totalInches % 12);
        setHeightFt(ft.toString());
        setHeightIn(inch.toString());
      }
    } else {
      // Convert US to metric
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inch;

      if (lbs && lbs > 0) {
        const kg = lbs * 0.453592;
        setWeight(parseFloat(kg.toFixed(1)).toString());
      }
      if (totalInches && totalInches > 0) {
        const cm = totalInches * 2.54;
        setHeight(Math.round(cm).toString());
      }
    }
  };

  const reset = () => {
    if (unitSystem === "metric") {
      setWeight("70");
      setHeight("175");
    } else {
      setWeightLbs("154");
      setHeightFt("5");
      setHeightIn("9");
    }
  };

  const bmiRanges = [
    { label: t.bmiCalculator.categories.underweight, range: "< 18.5", color: "bg-blue-500" },
    { label: t.bmiCalculator.categories.normal, range: "18.5 – 24.9", color: "bg-green-500" },
    { label: t.bmiCalculator.categories.overweight, range: "25.0 – 29.9", color: "bg-yellow-500" },
    { label: t.bmiCalculator.categories.obese1, range: "30.0 – 34.9", color: "bg-orange-500" },
    { label: t.bmiCalculator.categories.obese2, range: "35.0 – 39.9", color: "bg-red-500" },
    { label: t.bmiCalculator.categories.obese3, range: "≥ 40.0", color: "bg-red-700" },
  ];

  const howToUse = [
    { step: "Select Units", description: "Choose between Metric (kg/cm) or US (lbs/ft/in) systems." },
    { step: "Enter Details", description: "Input your current weight and height accurately." },
    { step: "See Results", description: "Check your BMI score and where it falls on the health chart." },
  ];

  const faqs = [
    { 
      question: "What is Body Mass Index (BMI)?", 
      answer: "Body Mass Index (BMI) is a mathematical estimation of body fatness based on an individual's height and weight. It is used as a screening tool to categorize adult health categories." 
    },
    { 
      question: "Why is muscle mass a limitation for BMI?", 
      answer: "BMI does not distinguish between muscle tissue, bone density, and body fat. Since muscle is denser than fat, muscular individuals (like bodybuilders or athletes) may register an overweight or obese BMI despite having very low body fat." 
    },
    { 
      question: "Are child and adult BMI calculations interpreted the same way?", 
      answer: "No. While the basic calculation formula is identical, a child's BMI score is plotted on age-and-sex-specific growth percentiles (e.g. CDC charts) because body composition changes rapidly during growth." 
    },
    {
      question: "Does this calculator support both imperial and metric units?",
      answer: "Yes! You can toggle between Metric Units (kilograms and centimeters) and US Units (pounds, feet, and inches) in the tabs at the top of the interface."
    },
    {
      question: "How do I calculate healthy weight targets?",
      answer: "A standard healthy BMI range falls between 18.5 and 24.9. You can calculate your ideal weight range by multiplying the square of your height in meters by 18.5 (lower bound) and 24.9 (upper bound)."
    },
    {
      question: "Is my personal health data saved anywhere?",
      answer: "Never. All height, weight, and BMI calculations run entirely inside your browser using client-side JavaScript. None of your metrics are transmitted to our servers or stored in any database."
    }
  ];

  const relatedTools = [
    { name: "Investment Calculator", href: "/investment-calculator" },
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
        <h4 className="font-bold text-base mb-2 text-amber-800 dark:text-amber-300">Medical & Health Disclaimer</h4>
        <p className="text-sm leading-relaxed m-0">
          Body Mass Index (BMI) is an anthropometric screening ratio, not a clinical diagnostic assessment of body composition or health risk. Factors such as muscle mass, bone density, age, and genetics significantly influence body composition. This tool is provided solely for educational reference and should not replace clinical diagnosis or professional medical advice. Always consult a certified healthcare professional for individual medical recommendations.
        </p>
      </div>

      <h3>Detailed Guide: Understanding Body Mass Index (BMI)</h3>
      <p>
        Body Mass Index (BMI) is a standard screening measurement adopted by the World Health Organization (WHO) and global health agencies to identify weight categories that may lead to health concerns. However, BMI is not a diagnostic tool; it is a general statistical indicator.
      </p>
      <h4>The BMI Calculation Formulas</h4>
      <p>
        The calculation varies depending on your preferred measurement units:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-inner flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Metric Formula</span>
          <MathFormula formula="\text{BMI} = \frac{\text{Weight (kg)}}{[\text{Height (m)}]^2}" />
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-inner flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">US Imperial Formula</span>
          <MathFormula formula="\text{BMI} = 703 \times \frac{\text{Weight (lbs)}}{[\text{Height (inches)}]^2}" />
        </div>
      </div>
      <h4>Biological Factors to Consider</h4>
      <p>
        Because BMI is a simple weight-to-height ratio, it is important to factor in other metrics when evaluating overall health:
      </p>
      <ul>
        <li><strong>Muscle Density:</strong> Muscle tissue weighs more than fat tissue of the same volume, causing active individuals to register high BMIs.</li>
        <li><strong>Ethnic Variances:</strong> Research shows that healthy weight and fat distribution bounds differ slightly across different genetic groups.</li>
        <li><strong>Aging:</strong> Older adults naturally lose muscle mass and carry more body fat than younger individuals at identical BMI scores.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title={customTitle || "BMI Calculator"}
      description={customDescription || "Quickly calculate your Body Mass Index (BMI) to understand your health status using Metric or US units."}
      summaryDefinition={customSummaryDefinition || "A Body Mass Index (BMI) calculator estimates body fatness based on an individual's weight and height. It classifies body composition into standardized World Health Organization (WHO) weight categories using Metric (kg/cm) or Imperial (lbs/ft/in) formulas."}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs space-y-4">
            <Tabs defaultValue="metric" className="w-full" value={unitSystem} onValueChange={handleUnitSystemChange}>
              <TabsList className="grid w-full grid-cols-2 h-11 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-800">
                <TabsTrigger value="metric" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">Metric Units</TabsTrigger>
                <TabsTrigger value="us" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">US Units</TabsTrigger>
              </TabsList>
              
              <form onSubmit={calculateBmi} className="mt-4 space-y-4">
                <TabsContent value="metric" className="space-y-4 m-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        Weight (kg) <Info className="h-3 w-3" />
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 70" 
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary transition-all"
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        Height (cm) <Info className="h-3 w-3" />
                      </label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 175" 
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary transition-all"
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="us" className="space-y-4 m-0">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 160" 
                      className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary transition-all"
                      value={weightLbs} 
                      onChange={(e) => setWeightLbs(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Height (Feet)</label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 5" 
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary transition-all"
                        value={heightFt} 
                        onChange={(e) => setHeightFt(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Height (Inches)</label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 10" 
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary transition-all"
                        value={heightIn} 
                        onChange={(e) => setHeightIn(e.target.value)} 
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="flex gap-2.5 pt-2">
                  <Button type="submit" className="flex-1 h-11 text-sm font-black shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer">
                    <Calculator className="mr-2 h-4 w-4" /> {t.bmiCalculator.calculateButton}
                  </Button>
                  <Button type="button" onClick={reset} variant="outline" className="h-11 px-3.5 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" title="Reset">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Tabs>
          </Card>

          <Card className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-xs space-y-1.5">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-primary" /> Healthy BMI Range
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Standard healthy BMI ranges between <strong>18.5 and 24.9</strong> according to WHO guidelines. Body composition, bone density, and muscle mass also influence individual metrics.
            </p>
          </Card>
        </div>

        {/* Right Column: Live Result Card & Range Chart */}
        <div ref={resultsRef} className="lg:col-span-7 lg:sticky lg:top-4 space-y-4 scroll-mt-24">
          {result && (
            <Card className="p-5 sm:p-6 text-center bg-zinc-50 dark:bg-zinc-900 border-2 rounded-2xl shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-black">{t.bmiCalculator.title}</div>
                <div className={`text-xs font-black ${result.color} bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg shadow-xs border`}>
                  {result.category}
                </div>
              </div>

              <div className="flex items-baseline justify-center gap-3 mb-3">
                <span className={`text-5xl sm:text-6xl font-black ${result.color} tracking-tight font-mono`}>
                  {result.bmi}
                </span>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">kg/m²</span>
              </div>

              {result.validationMessage ? (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-3">
                  {result.validationMessage}
                </p>
              ) : (
                <>
                  {/* Visual Gauge Scale */}
                  <div className="w-full max-w-sm mx-auto mb-4 px-2">
                    <div className="relative h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-green-400 via-yellow-400 to-red-500 overflow-visible mb-2">
                      {/* Floating gauge pointer */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-zinc-950 border-3 border-primary shadow-sm flex items-center justify-center transition-all duration-500"
                        style={{ 
                          left: `${Math.max(5, Math.min(95, ((Number(result.bmi) - 15) / 25) * 100))}%` 
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                      <span>15 Under</span>
                      <span>18.5 Normal</span>
                      <span>25 Over</span>
                      <span>30+ Obese</span>
                    </div>
                  </div>

                  {result.healthyWeightRange && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl max-w-sm mx-auto mb-3 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      <span className="font-bold uppercase tracking-wider block text-[10px] text-emerald-600 dark:text-emerald-400 mb-0.5">
                        {t.bmiCalculator.healthyRange}
                      </span>
                      <span className="font-bold text-xs text-foreground">{result.healthyWeightRange}</span>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2 border-t flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => copyShareUrl({
                    unit: unitSystem,
                    w: unitSystem === "metric" ? weight : undefined,
                    h: unitSystem === "metric" ? height : undefined,
                    lbs: unitSystem === "us" ? weightLbs : undefined,
                    ft: unitSystem === "us" ? heightFt : undefined,
                    in: unitSystem === "us" ? heightIn : undefined,
                  }, "BMI Calculation")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border font-bold h-9 text-xs text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Result
                </Button>
              </div>
            </Card>
          )}

          {/* WHO Category Range Table */}
          <Card className="overflow-hidden border-2 rounded-2xl shadow-xs">
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black tracking-tight text-foreground uppercase">WHO BMI Classification</h3>
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold">Adults 20+</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                    <th className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b">Category</th>
                    <th className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b text-right">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiRanges.map((item, i) => (
                    <tr 
                      key={i} 
                      className={`transition-colors ${result?.category === item.label ? "bg-primary/10 font-bold" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"}`}
                    >
                      <td className="py-2 px-3 border-b flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                        <span className={result?.category === item.label ? "text-primary font-black" : ""}>
                          {item.label}
                        </span>
                      </td>
                      <td className={`py-2 px-3 border-b text-right font-mono text-xs ${result?.category === item.label ? "text-primary font-black" : "text-muted-foreground"}`}>
                        {item.range}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
