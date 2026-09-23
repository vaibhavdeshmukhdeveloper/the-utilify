"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Plus, Minus, Info, ArrowRight, Share2, RotateCcw } from "lucide-react";
import { copyShareUrl } from "@/lib/share-utils";
import { getUIStrings, Locale } from "@/lib/i18n/ui-strings";

export interface DateCalculatorClientProps {
  initialTab?: "diff" | "math";
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function formatLocalDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Calendar-month addition with month-end day clamping.
 * Prevents Jan 31 + 1 month rolling over to March 2/3 in JavaScript Date.
 */
function addCalendarMonths(date: Date, months: number): Date {
  const totalMonths = date.getFullYear() * 12 + date.getMonth() + months;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;
  const originalDay = date.getDate();
  const maxDaysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const clampedDay = Math.min(originalDay, maxDaysInTargetMonth);
  return new Date(targetYear, targetMonth, clampedDay);
}

export default function DateCalculatorClient({
  initialTab = "diff",
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: DateCalculatorClientProps = {}) {
  const t = getUIStrings((lang as Locale) || "en");
  const dateLocale = lang === "es" ? "es-ES" : lang === "pt" ? "pt-BR" : "en-US";

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Tab 1: Diff states
  const [startDate, setStartDate] = useState(() => formatLocalDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    return formatLocalDate(future);
  });
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [diffResult, setDiffResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    businessDays: number;
    weekendDays: number;
    totalWeeks: number;
  } | null>(null);

  // Tab 2: Add/Sub states
  const [baseDate, setBaseDate] = useState(() => formatLocalDate(new Date()));
  const [operation, setOperation] = useState("add");
  const [addYears, setAddYears] = useState("0");
  const [addMonths, setAddMonths] = useState("0");
  const [addDays, setAddDays] = useState("30");
  const [mathResult, setMathResult] = useState<{
    formattedDate: string;
    dayOfWeek: string;
  } | null>(null);

  const diffResultsRef = useRef<HTMLDivElement>(null);
  const mathResultsRef = useRef<HTMLDivElement>(null);

  // Parse deep link query parameters on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab") || params.get("mode");
        const start = params.get("start") || params.get("startDate");
        const end = params.get("end") || params.get("endDate");
        const base = params.get("base") || params.get("baseDate");
        const op = params.get("op") || params.get("operation");
        const y = params.get("years");
        const m = params.get("months");
        const d = params.get("days");

        if (tab && (tab === "diff" || tab === "math")) setActiveTab(tab);
        if (start) setStartDate(start);
        if (end) setEndDate(end);
        if (base) setBaseDate(base);
        if (op && (op === "add" || op === "subtract")) setOperation(op);
        if (y) setAddYears(y);
        if (m) setAddMonths(m);
        if (d) setAddDays(d);
      }
    } catch (e) {
      console.error("Error parsing date params", e);
    }
  }, []);

  // Reactive Calculation: Date Difference
  useEffect(() => {
    const d1 = parseLocalDate(startDate);
    const d2 = parseLocalDate(endDate);

    if (!d1 || !d2) {
      setDiffResult(null);
      return;
    }

    // Sort so d1 is earlier
    const isSwapped = d1 > d2;
    const start = isSwapped ? d2 : d1;
    const end = isSwapped ? d1 : d2;

    // Total calendar days calculation using UTC timestamps (100% immune to DST changes)
    const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    const totalDays = Math.round((utc2 - utc1) / (24 * 60 * 60 * 1000)) + (includeEndDate ? 1 : 0);
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

    // Handle edge case where includeEndDate rolls over to a full month
    const currentMonthDays = new Date(start.getFullYear() + years, start.getMonth() + months + 1, 0).getDate();
    if (days >= currentMonthDays) {
      days -= currentMonthDays;
      months += 1;
      if (months >= 12) {
        years += 1;
        months -= 12;
      }
    }

    // Calculate Business Days (Mon-Fri) and Weekend Days (Sat-Sun)
    let businessDays = 0;
    let weekendDays = 0;
    const curDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    for (let i = 0; i < totalDays; i++) {
      const dow = curDate.getDay();
      if (dow === 0 || dow === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    setDiffResult({
      years,
      months,
      days,
      totalDays,
      businessDays,
      weekendDays,
      totalWeeks,
    });
  }, [startDate, endDate, includeEndDate]);

  // Reactive Calculation: Date Math (Add / Subtract)
  useEffect(() => {
    let d = parseLocalDate(baseDate);
    if (!d) {
      setMathResult(null);
      return;
    }

    const yrs = parseInt(addYears) || 0;
    const mths = parseInt(addMonths) || 0;
    const dys = parseInt(addDays) || 0;

    const multiplier = operation === "add" ? 1 : -1;

    // Apply adjustments: first months and years with month-end calendar clamping
    d = addCalendarMonths(d, (yrs * 12 + mths) * multiplier);
    // Then apply exact day offsets
    d.setDate(d.getDate() + dys * multiplier);

    setMathResult({
      formattedDate: d.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" }),
      dayOfWeek: d.toLocaleDateString(dateLocale, { weekday: "long" }),
    });
  }, [baseDate, operation, addYears, addMonths, addDays, dateLocale]);

  const handleResetDiff = () => {
    const today = new Date();
    setStartDate(formatLocalDate(today));
    const future = new Date(today);
    future.setDate(future.getDate() + 10);
    setEndDate(formatLocalDate(future));
    setIncludeEndDate(false);
    toast.info("Reset to default 10-day interval");
  };

  const setEndDateOffset = (days: number) => {
    const base = parseLocalDate(startDate) || new Date();
    const target = new Date(base);
    target.setDate(target.getDate() + days);
    setEndDate(formatLocalDate(target));
  };

  const setEndToYearEnd = () => {
    const base = parseLocalDate(startDate) || new Date();
    const endOfYear = new Date(base.getFullYear(), 11, 31);
    setEndDate(formatLocalDate(endOfYear));
  };

  const handleResetMath = () => {
    setBaseDate(formatLocalDate(new Date()));
    setOperation("add");
    setAddYears("0");
    setAddMonths("0");
    setAddDays("30");
    toast.info("Reset to default 30-day projection");
  };

  const applyMathPreset = (op: "add" | "subtract", y: number, m: number, d: number) => {
    setOperation(op);
    setAddYears(y.toString());
    setAddMonths(m.toString());
    setAddDays(d.toString());
  };

  const calculateDiff = (e: React.FormEvent) => {
    e.preventDefault();
    if (diffResultsRef.current) {
      diffResultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.success("Date difference calculated");
  };

  const calculateMath = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathResultsRef.current) {
      mathResultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      title={customTitle || "Date Calculator"}
      description={customDescription || "Calculate duration between dates or project new dates by adding or subtracting time units."}
      summaryDefinition={customSummaryDefinition}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-left">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="diff" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">Difference Between Dates</TabsTrigger>
            <TabsTrigger value="math" className="text-xs font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs">Add / Subtract Days</TabsTrigger>
          </TabsList>

          {/* Difference Tab */}
          <TabsContent value="diff" className="mt-4 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Controls */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs space-y-4">
                  <form onSubmit={calculateDiff} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Start Date
                        </label>
                        <button
                          type="button"
                          onClick={() => setStartDate(formatLocalDate(new Date()))}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Today
                        </button>
                      </div>
                      <Input
                        type="date"
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> End Date
                        </label>
                        <button
                          type="button"
                          onClick={() => setEndDate(formatLocalDate(new Date()))}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Today
                        </button>
                      </div>
                      <Input
                        type="date"
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-1 pt-1 items-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Quick Add:</span>
                        {[
                          { label: "+7D", days: 7 },
                          { label: "+30D", days: 30 },
                          { label: "+90D", days: 90 },
                          { label: "+180D", days: 180 },
                          { label: "+1Y", days: 365 },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setEndDateOffset(p.days)}
                            className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            {p.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={setEndToYearEnd}
                          className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                        >
                          Dec 31
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="includeEndDate"
                        checked={includeEndDate}
                        onChange={(e) => setIncludeEndDate(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-primary accent-primary cursor-pointer"
                      />
                      <label htmlFor="includeEndDate" className="text-xs font-bold text-muted-foreground cursor-pointer select-none">
                        Include end date (+1 day)
                      </label>
                    </div>

                    {startDate && endDate && startDate > endDate && (
                      <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        <span>Start is after End — calculating absolute interval.</span>
                      </div>
                    )}

                    <div className="flex gap-2.5 pt-2">
                      <Button type="submit" className="flex-1 h-11 text-sm font-black shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer">
                        Calculate Difference
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetDiff}
                        className="h-11 px-3.5 rounded-xl border-2 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        title="Reset dates"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              {/* Right Column: Live Breakdown & Totals */}
              <div ref={diffResultsRef} className="lg:col-span-7 lg:sticky lg:top-4 space-y-4 scroll-mt-24">
                {diffResult && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Years-Months-Days layout */}
                    <Card className="p-5 border-2 rounded-2xl text-center space-y-3 shadow-xs">
                      <div className="text-xs text-muted-foreground font-black uppercase tracking-wider">Elapsed Time Interval</div>
                      <div className="flex justify-center items-center gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="text-4xl sm:text-5xl font-black text-primary font-mono">{diffResult.years}</div>
                          <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">{t.dateCalculator.years}</div>
                        </div>
                        <div className="text-xl font-bold text-zinc-300 dark:text-zinc-700">/</div>
                        <div className="text-center">
                          <div className="text-4xl sm:text-5xl font-black text-primary font-mono">{diffResult.months}</div>
                          <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">{t.dateCalculator.months}</div>
                        </div>
                        <div className="text-xl font-bold text-zinc-300 dark:text-zinc-700">/</div>
                        <div className="text-center">
                          <div className="text-4xl sm:text-5xl font-black text-primary font-mono">{diffResult.days}</div>
                          <div className="text-[10px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">{t.dateCalculator.days}</div>
                        </div>
                      </div>
                    </Card>

                    {/* Totals grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <Card className="p-3.5 border-2 rounded-xl flex flex-col justify-center items-center text-center shadow-xs">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">{t.dateCalculator.businessDays}</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{diffResult.businessDays.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground">Mon–Fri</span>
                      </Card>
                      <Card className="p-3.5 border-2 rounded-xl flex flex-col justify-center items-center text-center shadow-xs">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">{t.dateCalculator.weekendDays}</span>
                        <span className="text-2xl font-black text-zinc-500 font-mono mt-1">{diffResult.weekendDays.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground">Sat &amp; Sun</span>
                      </Card>
                      <Card className="p-3.5 border-2 rounded-xl flex flex-col justify-center items-center text-center shadow-xs">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">{t.dateCalculator.totalDays}</span>
                        <span className="text-2xl font-black text-primary font-mono mt-1">{diffResult.totalDays.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground">Calendar</span>
                      </Card>
                      <Card className="p-3.5 border-2 rounded-xl flex flex-col justify-center items-center text-center shadow-xs">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">{t.dateCalculator.weeks}</span>
                        <span className="text-2xl font-black text-primary font-mono mt-1">{diffResult.totalWeeks.toLocaleString()}</span>
                        <span className="text-[9px] text-muted-foreground">Weeks</span>
                      </Card>
                    </div>

                    <div className="pt-1">
                      <Button
                        type="button"
                        onClick={() => copyShareUrl({
                          tab: "diff",
                          start: startDate,
                          end: endDate,
                        }, "Date Interval")}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl border font-bold h-9 text-xs text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Date Interval
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Math Tab */}
          <TabsContent value="math" className="mt-4 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-6 space-y-4">
                <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs space-y-4">
                  <form onSubmit={calculateMath} className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Base Date
                        </label>
                        <button
                          type="button"
                          onClick={() => setBaseDate(formatLocalDate(new Date()))}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Today
                        </button>
                      </div>
                      <Input
                        type="date"
                        className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operation</label>
                      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 h-11 rounded-xl items-center">
                        <Button
                          type="button"
                          variant={operation === "add" ? "default" : "ghost"}
                          onClick={() => setOperation("add")}
                          className="flex-1 rounded-lg h-9 font-bold text-xs cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                        <Button
                          type="button"
                          variant={operation === "subtract" ? "default" : "ghost"}
                          onClick={() => setOperation("subtract")}
                          className="flex-1 rounded-lg h-9 font-bold text-xs cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5 mr-1" /> Subtract
                        </Button>
                      </div>
                    </div>

                    {/* Adjustments row */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Duration Adjustment</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground">Years</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-10 text-center font-bold font-mono rounded-xl border-2"
                            value={addYears}
                            onChange={(e) => setAddYears(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground">Months</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-10 text-center font-bold font-mono rounded-xl border-2"
                            value={addMonths}
                            onChange={(e) => setAddMonths(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-muted-foreground">Days</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="h-10 text-center font-bold font-mono rounded-xl border-2"
                            value={addDays}
                            onChange={(e) => setAddDays(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 items-center pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Quick:</span>
                        {[
                          { label: "+7D", op: "add" as const, y: 0, m: 0, d: 7 },
                          { label: "+14D", op: "add" as const, y: 0, m: 0, d: 14 },
                          { label: "+30D", op: "add" as const, y: 0, m: 0, d: 30 },
                          { label: "+60D", op: "add" as const, y: 0, m: 0, d: 60 },
                          { label: "+90D", op: "add" as const, y: 0, m: 0, d: 90 },
                          { label: "+6M", op: "add" as const, y: 0, m: 6, d: 0 },
                          { label: "+1Y", op: "add" as const, y: 1, m: 0, d: 0 },
                          { label: "-30D", op: "subtract" as const, y: 0, m: 0, d: 30 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => applyMathPreset(preset.op, preset.y, preset.m, preset.d)}
                            className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <Button type="submit" className="flex-1 h-11 text-sm font-black shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer">
                        Calculate Target Date
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetMath}
                        className="h-11 px-3.5 rounded-xl border-2 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        title="Reset"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              {/* Right Column: Result */}
              <div ref={mathResultsRef} className="lg:col-span-6 lg:sticky lg:top-4 space-y-4 scroll-mt-24">
                {mathResult && (
                  <Card className="p-6 border-2 rounded-2xl text-center space-y-3.5 shadow-xs animate-in fade-in duration-200">
                    <div className="text-xs text-muted-foreground font-black uppercase tracking-wider">{t.dateCalculator.projectedDate}</div>
                    <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-mono">{mathResult.formattedDate}</div>
                    <div className="text-sm font-bold text-muted-foreground flex items-center justify-center gap-1.5 pb-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> {mathResult.dayOfWeek}
                    </div>
                    <div className="pt-2 border-t">
                      <Button
                        type="button"
                        onClick={() => copyShareUrl({
                          tab: "math",
                          base: baseDate,
                          op: operation,
                          years: addYears !== "0" ? addYears : undefined,
                          months: addMonths !== "0" ? addMonths : undefined,
                          days: addDays !== "0" ? addDays : undefined,
                        }, "Date Calculation")}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border font-bold h-9 text-xs text-primary border-primary/30 hover:bg-primary/5 mx-auto cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Calculation
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
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
