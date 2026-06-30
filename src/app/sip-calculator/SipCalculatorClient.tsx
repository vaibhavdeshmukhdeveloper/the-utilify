"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PiggyBank, RefreshCw, DollarSign, Calendar, Percent, TrendingUp, ArrowRight, Settings2, Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DonutChart, GrowthChart } from "@/components/CalculatorCharts";

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function SipCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("40,000");
  const [years, setYears] = useState("8");
  const [returnRate, setReturnRate] = useState("10");
  const [compoundFrequency, setCompoundFrequency] = useState("monthly");
  const [contributionTiming, setContributionTiming] = useState("beginning");

  const [result, setResult] = useState<{
    total: string;
    invested: string;
    returns: string;
    breakdown: YearlyBreakdown[];
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const formatNumber = (val: string) => {
    const isNegative = val.startsWith("-");
    const num = val.replace(/[^0-9.]/g, "");
    if (!num) return isNegative ? "-" : "";
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (isNegative ? "-" : "") + parts.join(".");
  };

  const parseNumber = (val: string) => {
    return val.replace(/,/g, "");
  };

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?[0-9,.]*$/.test(value)) {
      const rawValue = parseNumber(value);
      if (rawValue === "" || rawValue === "-" || !isNaN(Number(rawValue)) || rawValue === "." || rawValue === "-.") {
        setter(formatNumber(rawValue));
      }
    }
  };

  // Save to recently used history in local storage
  useEffect(() => {
    try {
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
    
    if (!t || t <= 0 || t > 100 || !monthlyInvestment) {
      setResult(null);
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

    setResult({
      total: currentBalance.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      invested: totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      returns: (currentBalance - totalInvested).toLocaleString('en-US', { maximumFractionDigits: 0 }),
      breakdown,
    });
  }, [monthlyInvestment, years, returnRate, compoundFrequency, contributionTiming]);

  const calculateSip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.success("SIP Projection Ready!");
  };

  const reset = () => {
    setMonthlyInvestment("");
    setYears("");
    setReturnRate("");
    setResult(null);
  };

  const exportToCsv = () => {
    if (!result) return;
    const headers = ["Year", "Invested Principal ($)", "Interest Earned ($)", "Total Balance ($)"];
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
      title="SIP Calculator"
      description="Calculate the potential growth of your monthly savings with a Systematic Investment Plan (SIP)."
      howToUse={[
        { step: "Monthly Amount", description: "How much you plan to save every month." },
        { step: "Investment Term", description: "The number of years you plan to stay invested." },
        { step: "Return Rate", description: "Expected annual percentage yield from your investment." }
      ]}
      faqs={[
        { 
          question: "What is a Systematic Investment Plan (SIP)?", 
          answer: "A Systematic Investment Plan (SIP) is a disciplined investment methodology where you allocate a fixed sum of money into mutual funds or index portfolios at regular intervals (usually monthly) rather than in a lump sum." 
        },
        { 
          question: "How does Rupee/Dollar Cost Averaging benefit me?", 
          answer: "By investing a flat sum consistently, you buy more portfolio units when market prices are low and fewer units when prices are high. This smooths out purchase costs and reduces timing risks." 
        },
        { 
          question: "Does this calculator support different compounding intervals?", 
          answer: "Yes. In the Advanced Settings, you can toggle between Monthly and Yearly compounding frequencies to align with different mutual fund, bank deposit, or stock return schemes." 
        },
        {
          question: "What does the 'Beginning' vs 'End' timing setting do?",
          answer: "'Beginning' assumes you make monthly deposits at the start of each month, earning interest on that deposit immediately. 'End' assumes deposits are made at the close of the month, starting compound interest calculation in the subsequent period."
        },
        {
          question: "Are SIP returns guaranteed?",
          answer: "No. SIP returns depend entirely on market fluctuations and the performance of the underlying mutual fund, ETF, or index portfolio. Projections are estimates based on historical averages."
        },
        {
          question: "Is my financial input data kept confidential?",
          answer: "Absolutely. All math formulas run completely inside your browser using JavaScript. No financial inputs or calculations are sent to servers or recorded on databases."
        }
      ]}
      relatedTools={[
        { name: "Investment Calculator", href: "/investment-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
      detailedContent={(
        <article className="space-y-6">
          <h3>Detailed Guide: Understanding SIP Compounding Projections</h3>
          <p>
            A Systematic Investment Plan (SIP) is widely considered the safest and most efficient path for long-term wealth accumulation. Unlike lump-sum investments, which expose all your capital to immediate market fluctuations, SIPs utilize consistency and time to generate exponential compound growth.
          </p>
          <h4>The Math Behind SIP Growth</h4>
          <p>
            When you invest a flat monthly amount, the portfolio compounds continuously. The future value is calculated using the following formula:
          </p>
          <p className="bg-muted p-4 rounded-xl font-mono text-center">
            FV = P &times; [ ( (1 + r)^n - 1 ) / r ] &times; (1 + r)
          </p>
          <p>
            Where:
          </p>
          <ul>
            <li><strong>FV:</strong> Future Value (Maturity Amount).</li>
            <li><strong>P:</strong> Monthly investment contribution.</li>
            <li><strong>r:</strong> Monthly rate of return (Annual Rate / 12 / 100).</li>
            <li><strong>n:</strong> Total number of monthly contributions (Years &times; 12).</li>
          </ul>
          <h4>Why Start a SIP Early?</h4>
          <p>
            The single most important variable in compound growth is time, not capital. Because interest compounds on top of previous interest, your balance curve grows exponentially in the later years. Delaying your investment plan by even five years can cut your final retirement corpus in half.
          </p>
        </article>
      )}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-8">
          <form onSubmit={calculateSip} className="space-y-6">
            <Card className="p-8 space-y-8 border-2 shadow-sm rounded-3xl">
              <div className="space-y-4">
                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Monthly SIP Amount
                </Label>
                <Input 
                  type="text" 
                  inputMode="numeric"
                  className="h-16 text-2xl font-black rounded-2xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                  value={monthlyInvestment} 
                  onChange={handleInputChange(setMonthlyInvestment)} 
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Years
                  </Label>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    className="h-16 text-2xl font-black rounded-2xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                    value={years} 
                    onChange={handleInputChange(setYears)} 
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" /> Rate (%)
                  </Label>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    className="h-16 text-2xl font-black rounded-2xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                    value={returnRate} 
                    onChange={handleInputChange(setReturnRate)} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Settings2 className="h-4 w-4" /> Advanced Settings
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Compounding Frequency</Label>
                  <Select value={compoundFrequency} onValueChange={(val) => val && setCompoundFrequency(val)}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Contribution Timing</Label>
                  <RadioGroup value={contributionTiming} onValueChange={setContributionTiming} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginning" id="beginning" />
                      <Label htmlFor="beginning" className="text-sm font-medium cursor-pointer">Beginning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end" id="end" />
                      <Label htmlFor="end" className="text-sm font-medium cursor-pointer">End</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 h-20 text-xl font-black shadow-xl hover:shadow-2xl transition-all rounded-[1.5rem] bg-primary text-primary-foreground">
                <PiggyBank className="mr-3 h-7 w-7" /> Calculate Growth
              </Button>
              <Button type="button" onClick={reset} variant="outline" className="h-20 px-8 rounded-[1.5rem] border-2">
                <RefreshCw className="h-7 w-7" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Results */}
        <div ref={resultsRef} className="lg:col-span-7 space-y-8 scroll-mt-24">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main Result Card */}
              <Card className="p-12 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <PiggyBank className="h-40 w-40" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500 mb-6">Total Estimated Value</div>
                  <div className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-12">${result.total}</div>
                  
                  <div className="grid grid-cols-2 gap-16 pt-10 border-t border-zinc-800">
                    <div>
                      <div className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Total Invested</div>
                      <div className="text-3xl font-bold">${result.invested}</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Wealth Gain</div>
                      <div className="text-3xl font-bold text-green-500">${result.returns}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Interactive Visual Charts Stack */}
              <div className="flex flex-col gap-6 w-full">
                <DonutChart 
                  invested={parseFloat(result.invested.replace(/,/g, '')) || 0} 
                  returns={parseFloat(result.returns.replace(/,/g, '')) || 0} 
                />
                <GrowthChart breakdown={result.breakdown} />
              </div>

              {/* Yearly Breakdown Table */}
              <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="p-10 bg-zinc-50 dark:bg-zinc-900 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Yearly Projection</h3>
                    <p className="text-muted-foreground mt-2">See how your portfolio grows year after year</p>
                  </div>
                  <Button 
                    onClick={exportToCsv} 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl border-2 font-bold h-11 shrink-0"
                  >
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur z-20">
                      <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                        <th className="p-6 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Year</th>
                        <th className="p-6 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Invested</th>
                        <th className="p-6 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Interest</th>
                        <th className="p-6 text-xs font-black uppercase tracking-wider text-muted-foreground border-b text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="p-6 font-black text-primary text-lg">Year {row.year}</td>
                          <td className="p-6 text-base font-medium text-zinc-600 dark:text-zinc-400">${row.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          <td className="p-6 text-base font-bold text-green-500">+${row.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          <td className="p-6 text-right font-black tracking-tight text-xl">${row.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full min-h-[500px] flex flex-col items-center justify-center p-16 text-center border-dashed border-4 bg-card rounded-[3rem] border-zinc-200 dark:border-zinc-800">
              <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-8">
                <PiggyBank className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4">Start Your SIP Plan</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-lg">
                Enter your monthly contribution and expected returns on the left to generate your wealth projection.
              </p>
              <div className="mt-12 flex items-center gap-3 text-base font-black text-primary animate-bounce">
                <ArrowRight className="h-5 w-5" /> Calculate now
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
