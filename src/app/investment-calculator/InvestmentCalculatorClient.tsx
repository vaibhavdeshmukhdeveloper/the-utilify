"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { TrendingUp, RefreshCw, DollarSign, Calendar, Percent, Info, Settings2, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function InvestmentCalculatorClient() {
  const [initialAmount, setInitialAmount] = useState("20,000");
  const [monthlyContribution, setMonthlyContribution] = useState("1,000");
  const [years, setYears] = useState("10");
  const [interestRate, setInterestRate] = useState("6");
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [contributionTiming, setContributionTiming] = useState("end");
  
  const [result, setResult] = useState<{
    total: string;
    invested: string;
    returns: string;
    breakdown: YearlyBreakdown[];
  } | null>(null);

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

  const calculateInvestment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const P = parseFloat(parseNumber(initialAmount)) || 0;
    const PMT = parseFloat(parseNumber(monthlyContribution)) || 0;
    const t = parseFloat(parseNumber(years));
    const annualRate = (parseFloat(parseNumber(interestRate)) || 0) / 100;
    
    if (!t || t <= 0) {
      toast.error("Please enter a valid number of years");
      return;
    }

    const breakdown: YearlyBreakdown[] = [];
    let currentBalance = P;
    let totalInvested = P;

    const periodsPerYear = compoundFrequency === "annually" ? 1 : 
                          compoundFrequency === "monthly" ? 12 : 
                          compoundFrequency === "daily" ? 365 : 12;
    
    const ratePerPeriod = annualRate / periodsPerYear;
    const monthsPerPeriod = 12 / periodsPerYear;

    for (let year = 1; year <= t; year++) {
      for (let p = 0; p < periodsPerYear; p++) {
        const balanceAtStartOfPeriod = currentBalance;
        let interestForPeriod = balanceAtStartOfPeriod * ratePerPeriod;
        
        for (let m = 0; m < monthsPerPeriod; m++) {
          if (contributionTiming === "beginning") {
            const monthsRemainingInPeriod = monthsPerPeriod - m;
            const interestOnContribution = PMT * (ratePerPeriod * (monthsRemainingInPeriod / monthsPerPeriod));
            interestForPeriod += interestOnContribution;
            currentBalance += PMT;
            totalInvested += PMT;
          } else {
            const monthsRemainingInPeriod = monthsPerPeriod - m - 1;
            if (monthsRemainingInPeriod > 0) {
              const interestOnContribution = PMT * (ratePerPeriod * (monthsRemainingInPeriod / monthsPerPeriod));
              interestForPeriod += interestOnContribution;
            }
            currentBalance += PMT;
            totalInvested += PMT;
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
    toast.success("Investment Projected!");
  };

  const reset = () => {
    setInitialAmount("");
    setMonthlyContribution("");
    setYears("");
    setInterestRate("");
    setResult(null);
  };

  return (
    <ToolLayout
      title="Investment Calculator"
      description="Calculate your future wealth by projecting investment growth with custom compounding and contribution timing."
      howToUse={[
        { step: "Initial Sum", description: "The amount you're starting with." },
        { step: "Contributions", description: "Regular monthly deposits." },
        { step: "Settings", description: "Adjust compounding frequency and timing for accuracy." }
      ]}
      faqs={[
        { question: "Beginning vs End?", answer: "Contributions at the beginning earn interest for that period, whereas end-of-period contributions start earning in the next period." },
        { question: "Compounding frequency?", answer: "The more often interest is added, the faster your money grows due to the power of compounding." }
      ]}
      relatedTools={[
        { name: "SIP Calculator", href: "/sip-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={calculateInvestment} className="space-y-6">
            <Card className="p-8 space-y-6 border-2 shadow-sm rounded-3xl">
              <div className="space-y-3">
                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Initial Investment
                </Label>
                <Input 
                  type="text" 
                  inputMode="numeric"
                  className="h-14 text-xl font-black rounded-2xl border-2 focus:border-primary transition-all"
                  value={initialAmount} 
                  onChange={handleInputChange(setInitialAmount)} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Monthly Contribution
                </Label>
                <Input 
                  type="text" 
                  inputMode="numeric"
                  className="h-14 text-xl font-black rounded-2xl border-2 focus:border-primary transition-all"
                  value={monthlyContribution} 
                  onChange={handleInputChange(setMonthlyContribution)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Years
                  </Label>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    className="h-14 text-xl font-black rounded-2xl border-2 focus:border-primary transition-all"
                    value={years} 
                    onChange={handleInputChange(setYears)} 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" /> Interest Rate
                  </Label>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    className="h-14 text-xl font-black rounded-2xl border-2 focus:border-primary transition-all"
                    value={interestRate} 
                    onChange={handleInputChange(setInterestRate)} 
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
                      <SelectItem value="daily">Daily</SelectItem>
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
              <Button type="submit" className="flex-1 h-16 text-lg font-black shadow-xl hover:shadow-2xl transition-all rounded-2xl">
                <TrendingUp className="mr-2 h-6 w-6" /> Project Wealth
              </Button>
              <Button type="button" onClick={reset} variant="outline" className="h-16 px-6 rounded-2xl border-2">
                <RefreshCw className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Results & Table */}
        <div className="lg:col-span-7 space-y-8">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Main Result Card */}
              <Card className="p-10 bg-zinc-950 text-zinc-50 border-none shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">Total Future Wealth</div>
                  <div className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-8">${result.total}</div>
                  
                  <div className="grid grid-cols-2 gap-12 pt-8 border-t border-zinc-800">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Principal</div>
                      <div className="text-2xl font-bold">${result.invested}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Interest</div>
                      <div className="text-2xl font-bold text-green-500">${result.returns}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Yearly Breakdown Table */}
              <Card className="overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border-b">
                  <h3 className="text-2xl font-black tracking-tight">Yearly Breakdown</h3>
                  <p className="text-sm text-muted-foreground mt-1">Growth projection for {years} years</p>
                </div>
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur z-20">
                      <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Year</th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Principal</th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Interest</th>
                        <th className="p-5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="p-5 font-black text-primary">Year {row.year}</td>
                          <td className="p-5 text-sm font-medium text-zinc-600 dark:text-zinc-400">${row.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          <td className="p-5 text-sm font-bold text-green-500">+${row.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          <td className="p-5 text-right font-black tracking-tight">${row.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-zinc-50/50 rounded-[2.5rem]">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Ready to plan?</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Enter your investment details on the left and click "Project Wealth" to see your results.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
                <ArrowRight className="h-4 w-4" /> Start by entering an amount
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
