"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PiggyBank, RefreshCw, DollarSign, Calendar, Percent, ArrowRight, Settings2, Download, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import dynamic from "next/dynamic";
import { MathFormula } from "@/components/MathFormula";
import { triggerConfetti } from "@/lib/confetti";
import { copyShareUrl } from "@/lib/share-utils";
import { useCurrency, formatCurrencyValue, formatNumberWithCurrency } from "@/lib/currency";
import { CurrencySelector } from "@/components/CurrencySelector";

const DonutChart = dynamic(() => import("@/components/CalculatorCharts").then((m) => m.DonutChart), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-2xl" />
});

const GrowthChart = dynamic(() => import("@/components/CalculatorCharts").then((m) => m.GrowthChart), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-2xl" />
});

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface SipCalculatorClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function SipCalculatorClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: SipCalculatorClientProps = {}) {
  const { currency, setCurrency, info: currencyInfo, format: formatCurrency } = useCurrency();
  const [monthlyInvestment, setMonthlyInvestment] = useState("1,000");
  const [years, setYears] = useState("10");
  const [returnRate, setReturnRate] = useState("12");
  const [compoundFrequency, setCompoundFrequency] = useState("monthly");
  const [contributionTiming, setContributionTiming] = useState("beginning");

  const [result, setResult] = useState<{
    total: string;
    invested: string;
    returns: string;
    subNote?: string;
    breakdown: YearlyBreakdown[];
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const formatNumber = (val: string) => {
    return formatNumberWithCurrency(val, currency);
  };

  const parseNumber = (val: string) => {
    return val.replace(/,/g, "");
  };

  // Re-format inputs whenever active currency / numbering system changes (e.g. INR Lakhs vs US Thousands)
  useEffect(() => {
    setMonthlyInvestment((prev) => formatNumberWithCurrency(parseNumber(prev), currency));
  }, [currency]);

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?[0-9,.]*$/.test(value)) {
      const rawValue = parseNumber(value);
      if (rawValue === "" || rawValue === "-" || !isNaN(Number(rawValue)) || rawValue === "." || rawValue === "-.") {
        setter(formatNumber(rawValue));
      }
    }
  };

  // Parse deep link query parameters on mount & save to recently used
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const currParam = params.get("currency") || params.get("curr");
        if (currParam) {
          setCurrency(currParam.toUpperCase());
        }

        const inv = params.get("investment") || params.get("amount") || params.get("monthly");
        const y = params.get("years") || params.get("duration") || params.get("term");
        const r = params.get("rate") || params.get("return") || params.get("cagr");
        const freq = params.get("freq") || params.get("frequency") || params.get("compound");
        const timing = params.get("timing");

        if (inv && !isNaN(Number(inv.replace(/,/g, "")))) {
          setMonthlyInvestment(formatNumberWithCurrency(inv.replace(/,/g, ""), currency));
        }
        if (y && !isNaN(Number(y))) {
          setYears(y);
        }
        if (r && !isNaN(Number(r))) {
          setReturnRate(r);
        }
        if (freq && (freq === "monthly" || freq === "annually")) {
          setCompoundFrequency(freq);
        }
        if (timing && (timing === "beginning" || timing === "end")) {
          setContributionTiming(timing);
        }
      }

      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const href = "/sip-calculator";
      
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Error setting recently used tools", e);
    }
  }, []);

  // Run calculation reactively when inputs change
  useEffect(() => {
    const P = parseFloat(parseNumber(monthlyInvestment)) || 0;
    const t = parseFloat(parseNumber(years));
    const annualRate = (parseFloat(parseNumber(returnRate)) || 0) / 100;
    
    if (isNaN(t) || t <= 0 || t > 100 || !monthlyInvestment.trim()) {
      setResult(null);
      return;
    }

    if (P <= 0) {
      setResult({
        total: "0",
        invested: "0",
        returns: "0",
        subNote: "SIP assumes regular positive investments. For drawdown or capital withdrawal, use the Investment Calculator.",
        breakdown: [],
      });
      return;
    }

    const breakdown: YearlyBreakdown[] = [];
    let currentBalance = 0;
    let totalInvested = 0;

    const periodsPerYear = compoundFrequency === "annually" ? 1 : 12;
    const ratePerPeriod = annualRate / periodsPerYear;
    const monthsPerPeriod = 12 / periodsPerYear;

    for (let year = 1; year <= t; year++) {
      for (let p = 0; p < periodsPerYear; p++) {
        const balanceAtStartOfPeriod = currentBalance;
        let interestForPeriod = balanceAtStartOfPeriod * ratePerPeriod;
        
        for (let m = 0; m < monthsPerPeriod; m++) {
          if (contributionTiming === "beginning") {
            const monthsRemainingInPeriod = monthsPerPeriod - m;
            const interestOnContribution = P * (ratePerPeriod * (monthsRemainingInPeriod / monthsPerPeriod));
            interestForPeriod += interestOnContribution;
            currentBalance += P;
            totalInvested += P;
          } else {
            const monthsRemainingInPeriod = monthsPerPeriod - m - 1;
            if (monthsRemainingInPeriod > 0) {
              const interestOnContribution = P * (ratePerPeriod * (monthsRemainingInPeriod / monthsPerPeriod));
              interestForPeriod += interestOnContribution;
            }
            currentBalance += P;
            totalInvested += P;
          }
        }
        currentBalance += interestForPeriod;
      }

      breakdown.push({
        year,
        principal: totalInvested,
        interest: currentBalance - totalInvested,
        balance: currentBalance,
      });
    }

    let subNote = undefined;
    if (annualRate < 0) {
      subNote = "A negative return rate simulates portfolio capital loss / market downturn.";
    }

    setResult({
      total: formatCurrencyValue(currentBalance, currency, { showSymbol: false }),
      invested: formatCurrencyValue(totalInvested, currency, { showSymbol: false }),
      returns: formatCurrencyValue(currentBalance - totalInvested, currency, { showSymbol: false }),
      subNote,
      breakdown,
    });
  }, [monthlyInvestment, years, returnRate, compoundFrequency, contributionTiming, currency]);

  const calculateSip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerConfetti();

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.success("SIP Projection Ready!");
  };

  const reset = () => {
    setMonthlyInvestment(currency === "INR" ? "5,000" : "1,000");
    setYears("10");
    setReturnRate("12");
    setCompoundFrequency("monthly");
    setContributionTiming("beginning");
  };

  const exportToCsv = () => {
    if (!result) return;
    const sym = currencyInfo.symbol;
    const headers = ["Year", `Invested Principal (${sym})`, `Interest Earned (${sym})`, `Total Balance (${sym})`];
    const rows = result.breakdown.map((row) => [
      `Year ${row.year}`,
      Math.round(row.principal),
      Math.round(row.interest),
      Math.round(row.balance)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sip_yearly_projection.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported yearly projection to CSV!");
  };

  return (
    <ToolLayout
      title={customTitle || "SIP Calculator"}
      description={customDescription || "Calculate the potential growth of your monthly savings with a Systematic Investment Plan (SIP)."}
      summaryDefinition={customSummaryDefinition || "A Systematic Investment Plan (SIP) calculator models the future value of recurring monthly mutual fund investments compounding over time. It calculates total invested capital, estimated wealth gain, and future maturity corpus based on expected annual return rates and investment duration."}
      howToUse={customHowToUse || [
        { step: "Monthly Amount", description: "How much you plan to save every month." },
        { step: "Investment Term", description: "The number of years you plan to stay invested." },
        { step: "Return Rate", description: "Expected annual percentage yield from your investment." }
      ]}
      faqs={customFaqs || [
        { 
          question: "What is a Systematic Investment Plan (SIP) and how does it work?", 
          answer: "A Systematic Investment Plan (SIP) is a disciplined investment approach where you invest a fixed sum into mutual funds or ETFs at regular intervals (typically monthly). It harnesses dollar-cost averaging and compounding growth to build wealth over time." 
        },
        {
          question: "What is the mathematical formula used to calculate SIP returns?",
          answer: "The future value of an ordinary annuity formula is: M = P × [((1 + i)^n - 1) / i] × (1 + i), where M is the maturity corpus, P is the periodic investment, i is the periodic interest rate (annual rate / 12), and n is the total number of monthly payments."
        },
        {
          question: "What is a Step-Up (Top-Up) SIP and why is it important?",
          answer: "A Step-Up SIP automatically increases your monthly investment by a fixed percentage (e.g. 5% to 10%) each year as your salary rises. Stepping up your SIP can more than double your final retirement corpus over 15 to 20 years."
        },
        {
          question: "What is the difference between SIP and a Lump Sum investment?",
          answer: "A Lump Sum involves investing an entire amount at once, making it sensitive to market entry timing. A SIP spreads investments over multiple market cycles, neutralizing volatility through Rupee/Dollar Cost Averaging."
        },
        {
          question: "How does inflation affect my future SIP maturity wealth?",
          answer: "Inflation erodes purchasing power over time. If your portfolio returns 12% annually and inflation is 5%, your real inflation-adjusted rate of return is approximately 7%. Planning with inflation ensures your corpus matches future living expenses."
        },
        { 
          question: "Does this calculator support different compounding intervals?", 
          answer: "Yes. In the Advanced Settings, you can toggle between Monthly and Yearly compounding frequencies to align with different mutual fund, bank deposit, or stock return schemes." 
        },
        {
          question: "Is my financial input data kept confidential?",
          answer: "Absolutely. All calculations run 100% locally inside your browser using client-side JavaScript. No financial inputs or investment plans are ever transmitted to external servers."
        }
      ]}
      relatedTools={[
        { name: "Investment Calculator", href: "/investment-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
      detailedContent={(
        <article className="space-y-6">
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
            <h4 className="font-bold text-base mb-2 text-amber-800 dark:text-amber-300">Important Financial Disclaimer</h4>
            <p className="text-sm leading-relaxed m-0">
              This SIP Calculator is provided solely for educational and illustrative purposes. Projections and compound interest calculations are mathematical estimates based on user-provided assumptions and do not guarantee future investment returns. This tool does not constitute financial, investment, or tax advice. Consult a certified financial planner before making financial decisions.
            </p>
          </div>

          <h3>Detailed Guide: Understanding SIP Compounding Projections</h3>
          <p>
            A Systematic Investment Plan (SIP) is widely considered the safest and most efficient path for long-term wealth accumulation. Unlike lump-sum investments, which expose all your capital to immediate market fluctuations, SIPs utilize consistency and time to generate exponential compound growth.
          </p>
          <h4>The Math Behind SIP Growth</h4>
          <p>
            When you invest a flat monthly amount, the portfolio compounds continuously. The future value is calculated using the following mathematical formula:
          </p>
          <div className="my-4 p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-inner flex flex-col items-center justify-center overflow-x-auto">
            <MathFormula formula="FV = P \times \left[ \frac{(1 + r)^n - 1}{r} \right] \times (1 + r)" />
          </div>
          <p>
            Where:
          </p>
          <ul>
            <li><strong>FV:</strong> Future Value (Maturity Amount).</li>
            <li><strong>P:</strong> Monthly investment contribution amount.</li>
            <li><strong>r:</strong> Monthly periodic rate of return (<MathFormula formula="r = \frac{\text{Annual Rate}}{12 \times 100}" displayMode={false} />).</li>
            <li><strong>n:</strong> Total number of monthly contributions (<MathFormula formula="n = \text{Years} \times 12" displayMode={false} />).</li>
          </ul>
          <h4>Why Start a SIP Early?</h4>
          <p>
            The single most important variable in compound growth is time, not capital. Because interest compounds on top of previous interest, your balance curve grows exponentially in the later years. Delaying your investment plan by even five years can cut your final retirement corpus in half.
          </p>
        </article>
      )}
    >
      <div className="w-full max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Control Bar: Header info + Currency Selector */}
        <div className="flex items-center justify-between gap-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground">
            <PiggyBank className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden sm:inline">Systematic Investment Plan Compounding Simulator</span>
            <span className="sm:hidden">SIP Growth Planner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">Currency:</span>
            <CurrencySelector value={currency} onChange={setCurrency} size="sm" />
          </div>
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-4">
            <form onSubmit={calculateSip} className="space-y-4">
              <Card className="p-4 sm:p-5 space-y-3.5 border-2 shadow-xs rounded-2xl">
                {/* Monthly Investment */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> Monthly SIP Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      {currencyInfo.symbol}
                    </span>
                    <Input 
                      type="text" 
                      inputMode="numeric"
                      className="h-11 pl-7 pr-3 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                      value={monthlyInvestment} 
                      onChange={handleInputChange(setMonthlyInvestment)} 
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {(currency === "INR" ? [
                      { label: "₹1,000", val: "1,000" },
                      { label: "₹5,000", val: "5,000" },
                      { label: "₹10,000", val: "10,000" },
                      { label: "₹25,000", val: "25,000" },
                    ] : [
                      { label: `${currencyInfo.symbol}250`, val: "250" },
                      { label: `${currencyInfo.symbol}500`, val: "500" },
                      { label: `${currencyInfo.symbol}1,000`, val: "1,000" },
                      { label: `${currencyInfo.symbol}2,500`, val: "2,500" },
                    ]).map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setMonthlyInvestment(chip.val)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          monthlyInvestment === chip.val
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years & Rate Side-by-Side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Years
                    </Label>
                    <Input 
                      type="text" 
                      inputMode="numeric"
                      className="h-11 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                      value={years} 
                      onChange={handleInputChange(setYears)} 
                    />
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {[
                        { label: "5Y", val: "5" },
                        { label: "10Y", val: "10" },
                        { label: "15Y", val: "15" },
                        { label: "20Y", val: "20" },
                      ].map((chip) => (
                        <button
                          key={chip.val}
                          type="button"
                          onClick={() => setYears(chip.val)}
                          className={`text-[10px] px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                            years === chip.val
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5" /> Rate (%)
                    </Label>
                    <Input 
                      type="text" 
                      inputMode="decimal"
                      className="h-11 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                      value={returnRate} 
                      onChange={handleInputChange(setReturnRate)} 
                    />
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {[
                        { label: "8%", val: "8" },
                        { label: "12%", val: "12" },
                        { label: "15%", val: "15" },
                      ].map((chip) => (
                        <button
                          key={chip.val}
                          type="button"
                          onClick={() => setReturnRate(chip.val)}
                          className={`text-[10px] px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                            returnRate === chip.val
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Compounding & Timing Settings */}
                <div className="pt-3 border-t space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
                    <Settings2 className="h-3.5 w-3.5" /> Advanced Settings
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase text-muted-foreground">Compounding Frequency</Label>
                    <Select value={compoundFrequency} onValueChange={(val) => val && setCompoundFrequency(val)}>
                      <SelectTrigger className="h-10 rounded-xl border-2 font-medium text-xs sm:text-sm">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <Label className="text-[11px] font-bold uppercase text-muted-foreground">Contribution Timing</Label>
                    <RadioGroup value={contributionTiming} onValueChange={setContributionTiming} className="flex gap-4">
                      <div className="flex items-center space-x-1.5">
                        <RadioGroupItem value="beginning" id="beginning" />
                        <Label htmlFor="beginning" className="text-xs font-medium cursor-pointer">Beginning</Label>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <RadioGroupItem value="end" id="end" />
                        <Label htmlFor="end" className="text-xs font-medium cursor-pointer">End</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 h-12 text-base font-black shadow-md hover:shadow-lg transition-all rounded-xl bg-primary text-primary-foreground">
                  <PiggyBank className="mr-2 h-5 w-5" /> Calculate Growth
                </Button>
                <Button type="button" onClick={reset} variant="outline" className="h-12 px-4 rounded-xl border-2">
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Results */}
          <div ref={resultsRef} className="lg:col-span-7 space-y-5 scroll-mt-24">
            {result ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Main Result Card */}
                <Card className="p-6 sm:p-7 bg-zinc-950 text-zinc-50 border-none shadow-xl rounded-2xl sm:rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <PiggyBank className="h-28 w-28" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-2">Total Estimated Value</div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3">
                      {currencyInfo.symbol}{result.total}
                    </div>
                    {result.subNote && (
                      <p className="text-xs sm:text-sm text-amber-400 font-medium mb-4">
                        {result.subNote}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-5 border-t border-zinc-800">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">Total Invested</div>
                        <div className="text-lg sm:text-xl font-bold">
                          {currencyInfo.symbol}{result.invested}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">
                          {result.returns.startsWith("-") ? "Total Loss" : "Wealth Gain"}
                        </div>
                        <div className={`text-lg sm:text-xl font-bold ${result.returns.startsWith("-") ? "text-red-500" : "text-emerald-400"}`}>
                          {result.returns.startsWith("-") ? `-${currencyInfo.symbol}${result.returns.slice(1)}` : `+${currencyInfo.symbol}${result.returns}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Interactive Visual Charts Stack */}
                {result.breakdown.length > 0 && (
                  <div className="flex flex-col gap-4 w-full">
                    <DonutChart 
                      currencyCode={currency}
                      invested={parseFloat(parseNumber(result.invested)) || 0} 
                      returns={parseFloat(parseNumber(result.returns)) || 0} 
                    />
                    <GrowthChart currencyCode={currency} breakdown={result.breakdown} />
                  </div>
                )}

                {/* Yearly Breakdown Table */}
                {result.breakdown.length > 0 && (
                <Card className="overflow-hidden border shadow-sm rounded-2xl">
                  <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-900 border-b flex flex-wrap gap-3 items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight">Yearly Projection</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">See how your portfolio grows year after year</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => copyShareUrl({
                          investment: parseNumber(monthlyInvestment),
                          years: parseNumber(years),
                          rate: parseNumber(returnRate),
                          freq: compoundFrequency !== "monthly" ? compoundFrequency : undefined,
                          timing: contributionTiming !== "beginning" ? contributionTiming : undefined,
                          currency: currency !== "USD" ? currency : undefined,
                        }, "SIP Calculation")} 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border font-bold h-9 shrink-0 text-primary border-primary/30 hover:bg-primary/5 text-xs"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Link
                      </Button>
                      <Button 
                        onClick={exportToCsv} 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border font-bold h-9 shrink-0 text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[420px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-background/95 backdrop-blur z-20">
                        <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Year</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Invested</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Interest</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {result.breakdown.map((row) => {
                          const isIntNeg = row.interest < 0;
                          const prinStr = formatCurrencyValue(row.principal, currency);
                          const intStr = (row.interest >= 0 ? "+" : "") + formatCurrencyValue(row.interest, currency);
                          const balStr = formatCurrencyValue(row.balance, currency);
                          return (
                            <tr key={row.year} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="p-3.5 font-bold text-xs sm:text-sm text-primary">Year {row.year}</td>
                              <td className="p-3.5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">{prinStr}</td>
                              <td className={`p-3.5 text-xs sm:text-sm font-bold ${isIntNeg ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>{intStr}</td>
                              <td className="p-3.5 text-right font-black tracking-tight text-xs sm:text-sm">{balStr}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
                )}
              </div>
            ) : (
              <Card className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center border-dashed border-2 bg-card rounded-2xl sm:rounded-3xl border-zinc-200 dark:border-zinc-800">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <PiggyBank className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2">Start Your SIP Plan</h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-xs sm:text-sm">
                  Enter your monthly contribution and expected returns on the left to generate your wealth projection.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
                  <ArrowRight className="h-4 w-4" /> Calculate now
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
