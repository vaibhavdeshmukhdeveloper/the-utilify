"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MathFormula } from "@/components/MathFormula";
import { triggerConfetti } from "@/lib/confetti";
import { 
  Flame, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Target, 
  Calendar, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function FireCalculatorClient() {
  const [annualExpenses, setAnnualExpenses] = useState<number>(48000);
  const [currentNetWorth, setCurrentNetWorth] = useState<number>(100000);
  const [monthlySavings, setMonthlySavings] = useState<number>(2000);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [expectedInflation, setExpectedInflation] = useState<number>(3.5);
  const [swr, setSwr] = useState<number>(4.0);
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const calculations = useMemo(() => {
    const swrDecimal = swr / 100;
    const fireNumber = swrDecimal > 0 ? Math.round(annualExpenses / swrDecimal) : 0;
    const leanFireNumber = Math.round(fireNumber * 0.75);
    const fatFireNumber = Math.round(fireNumber * 1.25);
    const baristaFireNumber = Math.round(fireNumber * 0.5);

    // Real CAGR (adjusted for inflation)
    const realReturnRate = Math.max(0.001, (1 + expectedReturn / 100) / (1 + expectedInflation / 100) - 1);
    const monthlyRealRate = realReturnRate / 12;

    // Simulation of compounding growth to target
    let months = 0;
    let balance = currentNetWorth;
    const maxMonths = 1200; // 100 years max

    if (balance >= fireNumber) {
      months = 0;
    } else {
      while (balance < fireNumber && months < maxMonths) {
        balance = balance * (1 + monthlyRealRate) + monthlySavings;
        months++;
      }
    }

    const yearsToFire = (months / 12).toFixed(1);
    const currentProgress = fireNumber > 0 ? Math.min(100, Math.round((currentNetWorth / fireNumber) * 100)) : 0;
    const annualPassiveIncome = Math.round(fireNumber * swrDecimal);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    const targetDateFormatted = targetDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    return {
      fireNumber,
      leanFireNumber,
      fatFireNumber,
      baristaFireNumber,
      months,
      yearsToFire,
      currentProgress,
      annualPassiveIncome,
      targetDateFormatted,
      realReturnRate: (realReturnRate * 100).toFixed(1)
    };
  }, [annualExpenses, currentNetWorth, monthlySavings, expectedReturn, expectedInflation, swr]);

  const handleCopySummary = () => {
    const text = `🔥 My FIRE Plan (The Utilify)
• Target FIRE Number: $${calculations.fireNumber.toLocaleString()}
• Safe Withdrawal Rate: ${swr}%
• Estimated Time to FIRE: ${calculations.yearsToFire} Years (${calculations.targetDateFormatted})
• Lean FIRE (75%): $${calculations.leanFireNumber.toLocaleString()}
• Fat FIRE (125%): $${calculations.fatFireNumber.toLocaleString()}
Calculate yours: https://www.theutilify.com/fire-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti();
    toast.success("FIRE plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const howToUse = [
    { step: "Enter Annual Spending", description: "Input your estimated annual household living expenses in retirement." },
    { step: "Set Growth & Savings", description: "Adjust your current savings, monthly contributions, and expected investment CAGR." },
    { step: "Analyze FIRE Tiers", description: "Review your target Lean, Standard, and Fat FIRE milestones and retirement timeline." },
  ];

  const faqs = [
    {
      question: "What is the 4% Rule in FIRE planning?",
      answer: "Based on the landmark Trinity Study, the 4% Rule states that an investor can safely withdraw 4% of their initial portfolio value in the first year of retirement, adjusting for inflation annually, with a 95%+ probability of never running out of money over a 30-year horizon."
    },
    {
      question: "How is the FIRE Number calculated?",
      answer: "Your FIRE Number is calculated by dividing your annual expenses by your Safe Withdrawal Rate (SWR). At a standard 4% SWR, this is equivalent to multiplying your annual living expenses by 25 (FIRE Number = Annual Expenses × 25)."
    },
    {
      question: "What is the difference between Lean FIRE, Standard FIRE, and Fat FIRE?",
      answer: "Lean FIRE targets a minimalist lifestyle (~75% of baseline spending), Standard FIRE covers your current lifestyle (100%), and Fat FIRE provides an abundant budget with luxury travel and higher discretionary spending (~125%+ of baseline)."
    },
    {
      question: "How does inflation affect my FIRE calculations?",
      answer: "Our calculator computes your real return using the Fisher equation: Real Return = (1 + Nominal Return) / (1 + Inflation) - 1. This ensures your target reflects true purchasing power in future dollars."
    }
  ];

  const relatedTools = [
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "Investment Calculator", href: "/investment-calculator" },
    { name: "Date Calculator", href: "/date-calculator" },
    { name: "Age Calculator", href: "/age-calculator" },
  ];

  return (
    <ToolLayout
      title="FIRE Calculator"
      description="Calculate your Financial Independence Retire Early (FIRE) number, annual spending targets, and milestone years using the 4% safe withdrawal rule."
      summaryDefinition="A FIRE calculator computes the total investment corpus required to achieve Financial Independence and Retire Early. By applying safe withdrawal rates (3.5%–4%) and inflation-adjusted compound growth, it models the exact timeline until passive portfolio withdrawals cover all living expenses."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Top Summary Header Banner */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-primary/10 border border-orange-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> 4% Safe Withdrawal Rule
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              ${calculations.fireNumber.toLocaleString()}
            </h2>
            <p className="text-sm text-muted-foreground">
              Target portfolio to generate <span className="font-bold text-foreground">${annualExpenses.toLocaleString()}/year</span> in perpetual passive income.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="text-center bg-card/80 backdrop-blur border rounded-2xl px-5 py-3 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground uppercase font-bold block">Years to FIRE</span>
              <span className="text-2xl font-black text-primary">{calculations.yearsToFire} Yrs</span>
              <span className="text-[11px] text-muted-foreground block">{calculations.targetDateFormatted}</span>
            </div>
            <Button
              onClick={handleCopySummary}
              className="rounded-2xl h-14 px-6 font-bold gap-2 w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Share Plan"}
            </Button>
          </div>
        </div>

        {/* Main Grid: Inputs vs Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Financial Assumptions
                </h3>
                <span className="text-xs text-muted-foreground font-mono">Real CAGR: ~{calculations.realReturnRate}%</span>
              </div>

              {/* Annual Expenses */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-foreground">Annual Living Expenses in Retirement</label>
                  <span className="text-primary font-mono font-black">${annualExpenses.toLocaleString()}</span>
                </div>
                <Slider
                  value={[annualExpenses]}
                  onValueChange={(val) => setAnnualExpenses(Array.isArray(val) ? val[0] : val)}
                  min={12000}
                  max={250000}
                  step={1000}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$12,000 / yr ($1k/mo)</span>
                  <span>$250,000 / yr (~$21k/mo)</span>
                </div>
              </div>

              {/* Current Net Worth */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-foreground">Current Investment Portfolio Net Worth</label>
                  <span className="text-foreground font-mono font-bold">${currentNetWorth.toLocaleString()}</span>
                </div>
                <Slider
                  value={[currentNetWorth]}
                  onValueChange={(val) => setCurrentNetWorth(Array.isArray(val) ? val[0] : val)}
                  min={0}
                  max={1000000}
                  step={5000}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$1,000,000+</span>
                </div>
              </div>

              {/* Monthly Savings */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-foreground">Monthly Investment Contribution</label>
                  <span className="text-foreground font-mono font-bold">${monthlySavings.toLocaleString()} / mo</span>
                </div>
                <Slider
                  value={[monthlySavings]}
                  onValueChange={(val) => setMonthlySavings(Array.isArray(val) ? val[0] : val)}
                  min={100}
                  max={20000}
                  step={100}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$100 / mo</span>
                  <span>$20,000 / mo</span>
                </div>
              </div>

              {/* Expected Return & Inflation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Expected Annual Return</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                      className="rounded-xl font-bold font-mono h-11"
                    />
                    <span className="text-sm font-bold text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Expected Inflation Rate</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={expectedInflation}
                      onChange={(e) => setExpectedInflation(parseFloat(e.target.value) || 0)}
                      className="rounded-xl font-bold font-mono h-11"
                    />
                    <span className="text-sm font-bold text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              {/* Safe Withdrawal Rate */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center text-sm font-bold">
                  <label className="text-foreground">Safe Withdrawal Rate (SWR)</label>
                  <span className="text-orange-500 font-mono font-black">{swr.toFixed(1)}% (Multiplier: {swr > 0 ? (100 / swr).toFixed(1) : 0}x)</span>
                </div>
                <Slider
                  value={[swr]}
                  onValueChange={(val) => setSwr(Array.isArray(val) ? val[0] : val)}
                  min={2.5}
                  max={5.0}
                  step={0.1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2.5% (Ultra-Conservative)</span>
                  <span>4.0% (Trinity Rule)</span>
                  <span>5.0% (Aggressive)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: FIRE Tiers & Progress */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress Card */}
            <Card className="p-6 rounded-3xl border bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">FIRE Portfolio Progress</h4>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {calculations.currentProgress}% Funded
                </span>
              </div>
              <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, calculations.currentProgress)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: ${currentNetWorth.toLocaleString()}</span>
                <span>Target: ${calculations.fireNumber.toLocaleString()}</span>
              </div>
            </Card>

            {/* FIRE Milestone Tiers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground px-1">
                FIRE Strategy Variations
              </h4>

              {/* Lean FIRE */}
              <Card className="p-5 rounded-2xl border bg-card/60 hover:bg-card transition-all flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-black text-sm text-foreground">Lean FIRE (75%)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Essential living expenses only</p>
                </div>
                <div className="text-right">
                  <span className="font-black font-mono text-base text-foreground">${calculations.leanFireNumber.toLocaleString()}</span>
                  <span className="text-[11px] text-muted-foreground block">${Math.round(annualExpenses * 0.75).toLocaleString()}/yr</span>
                </div>
              </Card>

              {/* Standard FIRE */}
              <Card className="p-5 rounded-2xl border-2 border-orange-500/30 bg-orange-500/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="font-black text-sm text-foreground">Standard FIRE (100%)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Current standard of living</p>
                </div>
                <div className="text-right">
                  <span className="font-black font-mono text-lg text-orange-600 dark:text-orange-400">${calculations.fireNumber.toLocaleString()}</span>
                  <span className="text-[11px] text-muted-foreground block">${annualExpenses.toLocaleString()}/yr</span>
                </div>
              </Card>

              {/* Fat FIRE */}
              <Card className="p-5 rounded-2xl border bg-card/60 hover:bg-card transition-all flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="font-black text-sm text-foreground">Fat FIRE (125%)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Abundant budget & luxury travel</p>
                </div>
                <div className="text-right">
                  <span className="font-black font-mono text-base text-foreground">${calculations.fatFireNumber.toLocaleString()}</span>
                  <span className="text-[11px] text-muted-foreground block">${Math.round(annualExpenses * 1.25).toLocaleString()}/yr</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mathematical Formulas Card */}
        <Card className="p-6 sm:p-8 rounded-3xl border bg-card space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-foreground">FIRE Mathematical Proof & Formula Breakdown</h3>
              <p className="text-xs text-muted-foreground">Governed by the 4% Rule and Compound Annuity Growth</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-muted/40 border space-y-3">
              <h4 className="font-bold text-sm text-foreground">1. The Standard FIRE Target Equation</h4>
              <MathFormula formula="\\text{FIRE Number} = \\frac{\\text{Annual Expenses}}{\\text{SWR}} = \\text{Annual Expenses} \\times 25" />
              <p className="text-xs text-muted-foreground">
                With a 4% Safe Withdrawal Rate (SWR), your target corpus is exactly 25 times your annual living expenses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/40 border space-y-3">
              <h4 className="font-bold text-sm text-foreground">2. Fisher Equation (Real Compound Growth)</h4>
              <MathFormula formula="r_{\\text{real}} = \\frac{1 + r_{\\text{nominal}}}{1 + i_{\\text{inflation}}} - 1" />
              <p className="text-xs text-muted-foreground">
                Accurately discounts nominal investment gains against consumer price inflation to maintain purchasing power.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
}
