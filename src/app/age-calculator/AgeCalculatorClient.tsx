"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Hourglass, Calendar, Gift, Clock, Info, Share2, RotateCcw, AlertCircle, Sparkles } from "lucide-react";
import { copyShareUrl } from "@/lib/share-utils";
import { getUIStrings, Locale } from "@/lib/i18n/ui-strings";

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

export interface AgeCalculatorClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

export default function AgeCalculatorClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: AgeCalculatorClientProps = {}) {
  const t = getUIStrings((lang as Locale) || "en");
  const [dob, setDob] = useState("1995-01-01");
  const [targetDate, setTargetDate] = useState(() => formatLocalDate(new Date()));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    nextBirthday: { months: number; days: number; hours: number; minutes: number; seconds: number };
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    isLeapDayBaby?: boolean;
  } | null>(null);

  const [liveMode, setLiveMode] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse deep link parameters on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const dobParam = params.get("dob") || params.get("birth") || params.get("birthDate");
        const targetParam = params.get("target") || params.get("targetDate") || params.get("at");

        if (dobParam) setDob(dobParam);
        if (targetParam) setTargetDate(targetParam);
      }
    } catch (e) {
      console.error("Error parsing age params", e);
    }
  }, []);

  const calculateAge = useCallback(() => {
    const dobDate = parseLocalDate(dob);
    const endDate = parseLocalDate(targetDate);

    if (!dobDate || !endDate) {
      setValidationError("Please select valid dates for both Date of Birth and Calculation Date.");
      setResult(null);
      return;
    }

    // If targetDate matches today's date, we use actual current time to enable live ticking
    const now = new Date();
    const isToday = targetDate === formatLocalDate(now);
    const comparisonDate = isToday ? now : endDate;

    if (dobDate > comparisonDate) {
      setValidationError("Date of birth cannot be in the future of the target date. Please select a birth date on or before the calculation date.");
      setResult(null);
      return;
    }
    setValidationError(null);

    // Years, Months, Days calculation
    let years = comparisonDate.getFullYear() - dobDate.getFullYear();
    let months = comparisonDate.getMonth() - dobDate.getMonth();
    let days = comparisonDate.getDate() - dobDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(comparisonDate.getFullYear(), comparisonDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Cumulative stats
    const diffMs = comparisonDate.getTime() - dobDate.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = parseFloat((totalDays / 7).toFixed(1));
    
    // Total months estimation
    let totalMonths = (comparisonDate.getFullYear() - dobDate.getFullYear()) * 12 + (comparisonDate.getMonth() - dobDate.getMonth());
    if (comparisonDate.getDate() < dobDate.getDate()) {
      totalMonths -= 1;
    }

    // Check if user was born on leap day (Feb 29)
    const isLeapDayDob = dobDate.getMonth() === 1 && dobDate.getDate() === 29;
    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

    // Check if birthday is today
    const isBirthdayToday = isLeapDayDob && !isLeapYear(comparisonDate.getFullYear())
      ? comparisonDate.getMonth() === 2 && comparisonDate.getDate() === 1 // March 1st in non-leap year
      : comparisonDate.getMonth() === dobDate.getMonth() && comparisonDate.getDate() === dobDate.getDate();

    let bdayMonths = 0;
    let bdayDays = 0;
    let bdayHrs = 0;
    let bdayMin = 0;
    let bdaySec = 0;

    if (!isBirthdayToday) {
      // Next Birthday calculation
      let nextBdayYear = comparisonDate.getFullYear();
      let nextBdayMonth = dobDate.getMonth();
      let nextBdayDate = dobDate.getDate();
      if (isLeapDayDob && !isLeapYear(nextBdayYear)) {
        nextBdayMonth = 2; // March
        nextBdayDate = 1;
      }
      let nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDate);
      if (nextBday.getTime() <= comparisonDate.getTime()) {
        nextBdayYear += 1;
        if (isLeapDayDob && !isLeapYear(nextBdayYear)) {
          nextBday = new Date(nextBdayYear, 2, 1);
        } else {
          nextBday = new Date(nextBdayYear, dobDate.getMonth(), dobDate.getDate());
        }
      }
      const bdayDiffMs = nextBday.getTime() - comparisonDate.getTime();
      const bdayTotalSec = Math.max(0, Math.floor(bdayDiffMs / 1000));

      bdaySec = bdayTotalSec % 60;
      bdayMin = Math.floor(bdayTotalSec / 60) % 60;
      bdayHrs = Math.floor(bdayTotalSec / 3600) % 24;

      // Estimate months and remaining days for next birthday
      bdayMonths = nextBday.getMonth() - comparisonDate.getMonth();
      bdayDays = nextBday.getDate() - comparisonDate.getDate();

      if (bdayDays < 0) {
        bdayMonths -= 1;
        const prev = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
        bdayDays += prev.getDate();
      }
      if (bdayMonths < 0) {
        bdayMonths += 12;
      }
    }

    setResult({
      years,
      months,
      days,
      nextBirthday: {
        months: bdayMonths,
        days: bdayDays,
        hours: bdayHrs,
        minutes: bdayMin,
        seconds: bdaySec,
      },
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      isLeapDayBaby: isLeapDayDob,
    });
  }, [dob, targetDate]);

  const handleReset = () => {
    setDob("1995-01-01");
    setTargetDate(formatLocalDate(new Date()));
    setValidationError(null);
    toast.info("Reset to default birth date (Jan 1, 1995)");
  };

  const setDobForAge = (targetYears: number) => {
    const now = new Date();
    const targetBirthYear = now.getFullYear() - targetYears;
    setDob(`${targetBirthYear}-01-01`);
  };

  const setTargetToEndOfYear = () => {
    const base = parseLocalDate(targetDate) || new Date();
    const end = new Date(base.getFullYear(), 11, 31);
    setTargetDate(formatLocalDate(end));
  };

  const setTargetYearOffset = (offsetYears: number) => {
    const base = parseLocalDate(targetDate) || new Date();
    const target = new Date(base.getFullYear() + offsetYears, base.getMonth(), base.getDate());
    setTargetDate(formatLocalDate(target));
  };

  // Set up live interval or single calculation
  useEffect(() => {
    const todayStr = formatLocalDate(new Date());
    const isToday = targetDate === todayStr;
    setLiveMode(isToday);

    if (isToday) {
      calculateAge();
      timerRef.current = setInterval(() => {
        calculateAge();
      }, 1000);
    } else {
      calculateAge();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dob, targetDate, calculateAge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateAge();
    toast.success("Age calculated successfully");
  };

  const howToUse = [
    { step: "Enter Date of Birth", description: "Select your exact birth date using the calendar input field." },
    { step: "Adjust Target Date", description: "Set the target date (defaults to today). Compare your age at any historical or future date." },
    { step: "View Live Timeline", description: "Observe your age in years, next birthday countdown, and total seconds lived ticker." },
  ];

  const faqs = [
    {
      question: "How does the live seconds ticker work?",
      answer: "When calculating age relative to 'Today', the calculator sets a browser timer that updates the millisecond difference every second. This displays a real-time count of your total lived seconds."
    },
    {
      question: "Are leap years accounted for in the cumulative days?",
      answer: "Yes. The calculations count the absolute elapsed milliseconds between the two calendar dates, which includes the extra day added for every leap year occurred (e.g. 2000, 2004, etc.)."
    },
    {
      question: "Is this calculator suitable for infants?",
      answer: "Yes, perfectly. If an infant is less than a year old, it will display '0 Years' and report the exact count in Months and Days, as well as total lived weeks."
    }
  ];

  const relatedTools = [
    { name: "Date Calculator", href: "/date-calculator" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "SIP Calculator", href: "/sip-calculator" },
  ];

  const detailedContent = (
    <article className="space-y-6">
      <h3>Detailed Guide: The Anatomy of Chronological Age</h3>
      <p>
        Chronological age measures the absolute passage of time from birth to a target date. While simple in concept, accounting for variable month lengths (28 to 31 days) and leap cycle shifts requires active offset mathematics.
      </p>
      <h4>Next Birthday Countdown:</h4>
      <p>
        To compute the remaining duration until your next birthday, the system temporarily projects your birth month and day onto the current year. If that date has already passed in the current year, the target shifts to the following year, calculating the precise difference down to the second.
      </p>
      <h4>Intriguing Time Milestones:</h4>
      <ul>
        <li><strong>1 Billion Seconds:</strong> A human reaches 1 billion seconds of age at approximately 31.7 years.</li>
        <li><strong>10,000 Days:</strong> Celebrated around age 27.4 years.</li>
        <li><strong>20,000 Days:</strong> Reached at approximately 54.8 years.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title={customTitle || "Age Calculator"}
      description={customDescription || "Find your exact age in years, months, weeks, and days. Track your next birthday countdown in real-time."}
      summaryDefinition={customSummaryDefinition}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-5 rounded-2xl border-2 shadow-xs space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Date of Birth
                </label>
                <Input
                  type="date"
                  className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <div className="flex flex-wrap gap-1 pt-1 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Milestones:</span>
                  {[
                    { label: "18Y", years: 18 },
                    { label: "25Y", years: 25 },
                    { label: "30Y", years: 30 },
                    { label: "40Y", years: 40 },
                    { label: "50Y", years: 50 },
                    { label: "65Y", years: 65 },
                  ].map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setDobForAge(m.years)}
                      className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Target Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setTargetDate(formatLocalDate(new Date()))}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Today
                  </button>
                </div>
                <Input
                  type="date"
                  className="h-11 text-base font-bold rounded-xl border-2 focus:border-primary"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
                <div className="flex flex-wrap gap-1 pt-1 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Target:</span>
                  <button
                    type="button"
                    onClick={setTargetToEndOfYear}
                    className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Dec 31
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetYearOffset(5)}
                    className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    +5 Yrs
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetYearOffset(10)}
                    className="px-2 py-0.5 text-[11px] rounded-md font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    +10 Yrs
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button type="submit" className="flex-1 h-11 text-sm font-black shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer">
                  Calculate Age
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-11 px-3.5 rounded-xl border-2 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  title="Reset to default dates"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          {validationError && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl flex items-center gap-2.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <p className="font-semibold">{validationError}</p>
            </div>
          )}
        </div>

        {/* Right Column: Live Results */}
        <div className="lg:col-span-7 lg:sticky lg:top-4 space-y-4 scroll-mt-24">
          {result && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {result.isLeapDayBaby && (
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl text-xs flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                  <span>Born on Leap Day (Feb 29): Celebrated on March 1st in common years.</span>
                </div>
              )}

              {/* Exact Age & Birthday Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
                {/* Exact Age Card */}
                <Card className="p-5 border-2 rounded-2xl text-center flex flex-col justify-center space-y-2 shadow-xs">
                  <div className="text-xs text-muted-foreground font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Hourglass className="h-3.5 w-3.5 text-primary" /> {t.ageCalculator.exactAge}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-primary tracking-tight font-mono">
                    {result.years} <span className="text-base text-muted-foreground font-normal">{t.ageCalculator.years}</span>
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    {result.months} {t.ageCalculator.months}, {result.days} {t.ageCalculator.days}
                  </div>
                  {liveMode && (
                    <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Ticking
                    </span>
                  )}
                </Card>

                {/* Next Birthday Card */}
                <Card className="p-5 border-2 rounded-2xl text-center flex flex-col justify-center space-y-2.5 shadow-xs">
                  <div className="text-xs text-muted-foreground font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-primary" /> {t.ageCalculator.nextBirthday}
                  </div>
                  <div className="flex justify-center items-center gap-2.5">
                    <div className="text-center">
                      <div className="text-xl font-black text-primary font-mono">{result.nextBirthday.months}</div>
                      <div className="text-[9px] uppercase font-bold text-muted-foreground">Mths</div>
                    </div>
                    <div className="text-muted-foreground font-bold">:</div>
                    <div className="text-center">
                      <div className="text-xl font-black text-primary font-mono">{result.nextBirthday.days}</div>
                      <div className="text-[9px] uppercase font-bold text-muted-foreground">Days</div>
                    </div>
                    <div className="text-muted-foreground font-bold">:</div>
                    <div className="text-center">
                      <div className="text-xl font-black text-primary font-mono">{result.nextBirthday.hours.toString().padStart(2, "0")}</div>
                      <div className="text-[9px] uppercase font-bold text-muted-foreground">Hrs</div>
                    </div>
                    <div className="text-muted-foreground font-bold">:</div>
                    <div className="text-center">
                      <div className="text-xl font-black text-primary font-mono">{result.nextBirthday.minutes.toString().padStart(2, "0")}</div>
                      <div className="text-[9px] uppercase font-bold text-muted-foreground">Mins</div>
                    </div>
                    <div className="text-muted-foreground font-bold">:</div>
                    <div className="text-center">
                      <div className="text-xl font-black text-primary font-mono">{result.nextBirthday.seconds.toString().padStart(2, "0")}</div>
                      <div className="text-[9px] uppercase font-bold text-muted-foreground">Secs</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight font-medium">
                    {result.nextBirthday.months === 0 && result.nextBirthday.days === 0
                      ? t.ageCalculator.happyBirthday
                      : t.ageCalculator.birthdayIn(result.nextBirthday.months, result.nextBirthday.days)}
                  </p>
                </Card>
              </div>

              {/* Cumulative stats */}
              <Card className="p-4 border-2 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider">{t.ageCalculator.milestones}</h3>
                  <Button
                    type="button"
                    onClick={() => copyShareUrl({
                      dob,
                      target: targetDate,
                    }, "Age Calculation")}
                    variant="outline"
                    size="sm"
                    className="rounded-lg border font-bold h-8 text-xs text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                  </Button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalMonths.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Months</div>
                  </div>
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalWeeks.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Weeks</div>
                  </div>
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalDays.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Days</div>
                  </div>
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalHours.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Hours</div>
                  </div>
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalMinutes.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Minutes</div>
                  </div>
                  <div className="p-2 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <div className="text-sm font-black text-primary font-mono truncate">{result.totalSeconds.toLocaleString()}</div>
                    <div className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">Seconds</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-normal">
            Your privacy is fully protected. All age calculation math, birthdays, and timers run locally on your browser. No details are transmitted.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}


