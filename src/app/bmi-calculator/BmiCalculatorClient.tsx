"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Calculator, RefreshCw, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<{ bmi: string; category: string; color: string } | null>(null);

  const calculateBmi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let bmiValue = 0;

    if (unitSystem === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      if (!w || !h || w <= 0 || h <= 0) {
        toast.error("Please enter valid metric units");
        return;
      }
      bmiValue = w / (h * h);
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inch;
      
      if (!lbs || !totalInches || lbs <= 0 || totalInches <= 0) {
        toast.error("Please enter valid US units");
        return;
      }
      // BMI formula (US): 703 * (weight / height^2)
      bmiValue = 703 * (lbs / (totalInches * totalInches));
    }

    const bmiStr = bmiValue.toFixed(1);
    let category = "";
    let color = "";

    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmiValue < 25) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmiValue < 30) {
      category = "Overweight";
      color = "text-yellow-500";
    } else if (bmiValue < 35) {
      category = "Obese Class I";
      color = "text-orange-500";
    } else if (bmiValue < 40) {
      category = "Obese Class II";
      color = "text-red-500";
    } else {
      category = "Obese Class III";
      color = "text-red-700";
    }

    setResult({ bmi: bmiStr, category, color });
    toast.success("BMI Calculated");
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setWeightLbs("");
    setHeightFt("");
    setHeightIn("");
    setResult(null);
  };

  const bmiRanges = [
    { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
    { label: "Normal weight", range: "18.5 – 24.9", color: "bg-green-500" },
    { label: "Overweight", range: "25.0 – 29.9", color: "bg-yellow-500" },
    { label: "Obese Class I", range: "30.0 – 34.9", color: "bg-orange-500" },
    { label: "Obese Class II", range: "35.0 – 39.9", color: "bg-red-500" },
    { label: "Obese Class III", range: "≥ 40.0", color: "bg-red-700" },
  ];

  const howToUse = [
    { step: "Select Units", description: "Choose between Metric (kg/cm) or US (lbs/ft/in) systems." },
    { step: "Enter Details", description: "Input your current weight and height accurately." },
    { step: "See Results", description: "Check your BMI score and where it falls on the health chart." },
  ];

  const faqs = [
    { 
      question: "Is BMI the only measure of health?", 
      answer: "No, while useful, BMI doesn't measure body fat directly or consider muscle mass, bone density, or overall body composition." 
    },
    { 
      question: "What if I have high muscle mass?", 
      answer: "Athletes with high muscle mass may have a high BMI score while being perfectly healthy, as muscle is denser than fat." 
    },
    { 
      question: "How often should I check my BMI?", 
      answer: "Checking every few months can help track trends in your weight and general health status." 
    },
  ];

  const relatedTools = [
    { name: "Investment Calculator", href: "/investment-calculator" },
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "Image Compressor", href: "/image-compressor" },
  ];

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Quickly calculate your Body Mass Index (BMI) to understand your health status using Metric or US units."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Tabs defaultValue="metric" className="w-full" onValueChange={setUnitSystem}>
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900">
              <TabsTrigger value="metric" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Metric Units</TabsTrigger>
              <TabsTrigger value="us" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">US Units</TabsTrigger>
            </TabsList>
            
            <form onSubmit={calculateBmi} className="mt-8 space-y-6">
              <TabsContent value="metric" className="space-y-6 m-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      Weight (kg) <Info className="h-3 w-3" />
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 70" 
                      className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all"
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      Height (cm) <Info className="h-3 w-3" />
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 175" 
                      className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all"
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)} 
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="us" className="space-y-6 m-0">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Weight (lbs)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 160" 
                    className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all"
                    value={weightLbs} 
                    onChange={(e) => setWeightLbs(e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Height (Feet)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 5" 
                      className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all"
                      value={heightFt} 
                      onChange={(e) => setHeightFt(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Height (Inches)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 10" 
                      className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all"
                      value={heightIn} 
                      onChange={(e) => setHeightIn(e.target.value)} 
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 h-14 text-lg font-black shadow-lg hover:shadow-xl transition-all rounded-xl">
                  <Calculator className="mr-2 h-5 w-5" /> Calculate BMI
                </Button>
                <Button type="button" onClick={reset} variant="outline" className="h-14 px-6 rounded-xl border-2 hover:bg-zinc-100">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Tabs>

          {result && (
            <Card className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl animate-in fade-in slide-in-from-bottom-4">
              <div className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-black mb-4">Your Body Mass Index (BMI)</div>
              <div className={`text-7xl font-black mb-6 ${result.color} tracking-tighter`}>
                {result.bmi}
              </div>
              <div className={`text-xl font-black ${result.color} bg-white dark:bg-zinc-800 inline-flex items-center px-6 py-2 rounded-2xl shadow-sm border`}>
                {result.category}
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                Based on your input, your BMI indicates that you are in the <strong>{result.category}</strong> range.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl">
            <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-b">
              <h3 className="text-2xl font-black tracking-tight">BMI Range Chart</h3>
              <p className="text-sm text-muted-foreground mt-1">Standard World Health Organization (WHO) categories</p>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                    <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Category</th>
                    <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b text-right">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiRanges.map((item, i) => (
                    <tr 
                      key={i} 
                      className={`group transition-colors ${result?.category === item.label ? "bg-primary/5" : "hover:bg-zinc-50/50"}`}
                    >
                      <td className="p-5 border-b flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className={`font-bold ${result?.category === item.label ? "text-primary" : ""}`}>
                          {item.label}
                        </span>
                      </td>
                      <td className={`p-5 border-b text-right font-mono text-sm ${result?.category === item.label ? "text-primary font-black" : "text-muted-foreground"}`}>
                        {item.range}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This chart applies to adults aged 20 years and older. For children and teens, BMI is interpreted differently using age and sex-specific percentiles.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-primary text-primary-foreground rounded-3xl shadow-[0_20px_50px_rgba(var(--primary),0.2)]">
            <h3 className="text-xl font-black mb-4">Did you know?</h3>
            <p className="opacity-90 leading-relaxed">
              Maintaining a healthy weight is important for overall health. In addition to BMI, healthcare providers use other measurements and factors - such as skinfold thickness, waist circumference, and diet - to assess a person’s health status.
            </p>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
