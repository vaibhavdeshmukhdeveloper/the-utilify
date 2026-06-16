"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Plus, Minus, Info, ArrowRight } from "lucide-react";

export default function DateCalculatorClient() {
  const [activeTab, setActiveTab] = useState("diff");

  // Tab 1: Diff states
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [diffResult, setDiffResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
  } | null>(null);

  // Tab 2: Add/Sub states
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [operation, setOperation] = useState("add");
  const [addYears, setAddYears] = useState("0");
  const [addMonths, setAddMonths] = useState("0");
  const [addDays, setAddDays] = useState("30");
  const [mathResult, setMathResult] = useState<{
    formattedDate: string;
    dayOfWeek: string;
  } | null>(null);

  const calculateDiff = (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      toast.error("Please enter valid dates");
      return;
    }

    // Sort so d1 is earlier
    const isSwapped = d1 > d2;
    const start = isSwapped ? d2 : d1;
    const end = isSwapped ? d1 : d2;

    // Total days calculation
    let totalMs = end.getTime() - start.getTime();
    if (includeEndDate) {
      totalMs += 24 * 60 * 60 * 1000;
    }
    const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));
    const totalWeeks = parseFloat((totalDays / 7).toFixed(1));

    // Y-M-D breakdown
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (includeEndDate) {
      days += 1;
    }

    if (days < 0) {
      months -= 1;
      // get days in previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setDiffResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
    });
    toast.success("Date difference calculated");
  };

  const calculateMath = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) {
      toast.error("Please enter a valid start date");
      return;
    }

    const yrs = parseInt(addYears) || 0;
    const mths = parseInt(addMonths) || 0;
    const dys = parseInt(addDays) || 0;

    const multiplier = operation === "add" ? 1 : -1;

    // Apply adjustments using native setters
    d.setFullYear(d.getFullYear() + yrs * multiplier);
    d.setMonth(d.getMonth() + mths * multiplier);
    d.setDate(d.getDate() + dys * multiplier);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    setMathResult({
      formattedDate: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      dayOfWeek: d.toLocaleDateString("en-US", { weekday: "long" }),
    });
    toast.success("Calculated target date");
  };

  const howToUse = [
    { step: "Select Action Mode", description: "Choose between 'Difference' to find time between dates, or 'Add/Subtract' to project a calendar date." },
    { step: "Input Date Parameters", description: "Select the starting dates, inputs, operations (add/subtract), and duration properties." },
    { step: "See Results", description: "Read immediate, breakdown data: years, months, weeks, days, and weekday categories." },
  ];

  const faqs = [
    {
      question: "How does the date difference handle leap years?",
      answer: "Leap years are handled automatically by the native JavaScript Date engine, correctly shifting February to 29 days when crossing leap periods (e.g. 2024, 2028)."
    },
    {
      question: "What does 'Include end date (+1 day)' mean?",
      answer: "By default, duration calculations count the intervals between dates (e.g., Monday to Tuesday is 1 day). Checking this box includes both the starting and closing days as active duration days (e.g., Monday to Tuesday counts as 2 days)."
    },
    {
      question: "Does timezone offset affect calculations?",
      answer: "No. The picker handles inputs as local timezone midnight boundaries, ensuring consistency when running standard day differences."
    }
  ];

  const relatedTools = [
    { name: "Age Calculator", href: "/age-calculator" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "Investment Calculator", href: "/investment-calculator" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: Understanding Calendar Time Metrics</h3>
      <p>
        Measuring time durations across historical timelines requires adjusting for varying calendar patterns. The Gregorian Calendar has irregular month lengths (28, 30, or 31 days) and leap rules.
      </p>
      <h4>Difference Breakdown Method:</h4>
      <p>
        The calculation matches day alignments. If the closing date's day of the month is less than the starting date's, the system borrows days from the preceding month to align the remainder correctly.
      </p>
      <h4>Practical Uses:</h4>
      <ul>
        <li><strong>Project Milestones:</strong> Track total weeks or calendar days remaining until delivery.</li>
        <li><strong>Contract Expiry:</strong> Calculate months/days until subscription terms complete.</li>
        <li><strong>Date Shifting:</strong> Subtract 90 days to find when credit invoices were issued.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title="Date Calculator"
      description="Calculate duration between dates or project new dates by adding or subtracting time units."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 text-left">
        <Tabs defaultValue="diff" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl p-1 bg-zinc-100 dark:bg-zinc-900">
            <TabsTrigger value="diff" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Difference Between Dates</TabsTrigger>
            <TabsTrigger value="math" className="text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">Add / Subtract Days</TabsTrigger>
          </TabsList>

          {/* Difference Tab */}
          <TabsContent value="diff" className="mt-8 m-0 space-y-8">
            <form onSubmit={calculateDiff} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Start Date</label>
                <Input
                  type="date"
                  className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="h-4 w-4" /> End Date</label>
                <Input
                  type="date"
                  className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 p-2">
                <input
                  type="checkbox"
                  id="includeEndDate"
                  checked={includeEndDate}
                  onChange={(e) => setIncludeEndDate(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-primary accent-primary"
                />
                <label htmlFor="includeEndDate" className="text-sm font-bold text-muted-foreground cursor-pointer select-none">
                  Include end date in calculation (adds 1 day)
                </label>
              </div>

              <Button type="submit" className="md:col-span-2 h-14 text-lg font-black shadow-lg rounded-xl">
                Calculate Difference
              </Button>
            </form>

            {diffResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Years-Months-Days layout */}
                <Card className="p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-3xl text-center space-y-4">
                  <div className="text-sm text-muted-foreground font-black uppercase tracking-widest">Time Breakdown</div>
                  <div className="flex justify-center items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-black text-primary font-mono">{diffResult.years}</div>
                      <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Years</div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-300">/</div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-primary font-mono">{diffResult.months}</div>
                      <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Months</div>
                    </div>
                    <div className="text-2xl font-bold text-zinc-300">/</div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-primary font-mono">{diffResult.days}</div>
                      <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-1">Days</div>
                    </div>
                  </div>
                </Card>

                {/* Totals layout */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  <Card className="p-6 border-none bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Total Days</span>
                    <span className="text-3xl font-black text-primary font-mono mt-2">{diffResult.totalDays.toLocaleString()}</span>
                  </Card>
                  <Card className="p-6 border-none bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Total Weeks</span>
                    <span className="text-3xl font-black text-primary font-mono mt-2">{diffResult.totalWeeks.toLocaleString()}</span>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Math Tab */}
          <TabsContent value="math" className="mt-8 m-0 space-y-8">
            <form onSubmit={calculateMath} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Base Date</label>
                  <Input
                    type="date"
                    className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Operation</label>
                  <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 h-14 rounded-xl items-center">
                    <Button
                      type="button"
                      variant={operation === "add" ? "default" : "ghost"}
                      onClick={() => setOperation("add")}
                      className="flex-1 rounded-lg h-12 font-bold"
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Add
                    </Button>
                    <Button
                      type="button"
                      variant={operation === "subtract" ? "default" : "ghost"}
                      onClick={() => setOperation("subtract")}
                      className="flex-1 rounded-lg h-12 font-bold"
                    >
                      <Minus className="h-4 w-4 mr-1.5" /> Subtract
                    </Button>
                  </div>
                </div>
              </div>

              {/* Adjustments row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Years</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-12 text-center font-bold font-mono rounded-xl border-2"
                    value={addYears}
                    onChange={(e) => setAddYears(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Months</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-12 text-center font-bold font-mono rounded-xl border-2"
                    value={addMonths}
                    onChange={(e) => setAddMonths(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Days</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="h-12 text-center font-bold font-mono rounded-xl border-2"
                    value={addDays}
                    onChange={(e) => setAddDays(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-black shadow-lg rounded-xl">
                Calculate Target Date
              </Button>
            </form>

            {mathResult && (
              <Card className="p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-3xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xl mx-auto">
                <div className="text-sm text-muted-foreground font-black uppercase tracking-widest">Calculated Date</div>
                <div className="text-3xl font-black text-primary tracking-tight">{mathResult.formattedDate}</div>
                <div className="text-lg font-bold text-muted-foreground flex items-center justify-center gap-1.5">
                  <ArrowRight className="h-4 w-4 text-primary" /> {mathResult.dayOfWeek}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-normal">
            <strong>Timezone Note:</strong> This calculator computes differences purely based on calendar dates (local time zone). Hours are not incremented to ensure clean full day integers.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
