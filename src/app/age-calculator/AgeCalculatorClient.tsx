"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Hourglass, Calendar, Gift, Clock, Info } from "lucide-react";

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState("1995-01-01");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);
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
  } | null>(null);

  const [liveMode, setLiveMode] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateAge = useCallback(() => {
    const dobDate = new Date(dob);
    const endDate = new Date(targetDate);

    // If targetDate matches today's date, we use actual current time to enable live ticking
    const now = new Date();
    const isToday = targetDate === now.toISOString().split("T")[0];
    const comparisonDate = isToday ? now : endDate;

    if (isNaN(dobDate.getTime()) || isNaN(comparisonDate.getTime())) {
      return;
    }

    if (dobDate > comparisonDate) {
      setResult(null);
      return;
    }

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
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = parseFloat((totalDays / 7).toFixed(1));
    
    // Total months estimation
    let totalMonths = (comparisonDate.getFullYear() - dobDate.getFullYear()) * 12 + (comparisonDate.getMonth() - dobDate.getMonth());
    if (comparisonDate.getDate() < dobDate.getDate()) {
      totalMonths -= 1;
    }

    // Next Birthday calculation
    const nextBday = new Date(comparisonDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());
    if (nextBday < comparisonDate) {
      nextBday.setFullYear(comparisonDate.getFullYear() + 1);
    }
    const bdayDiffMs = nextBday.getTime() - comparisonDate.getTime();
    const bdayTotalSec = Math.floor(bdayDiffMs / 1000);

    const bdaySec = bdayTotalSec % 60;
    const bdayMin = Math.floor(bdayTotalSec / 60) % 60;
    const bdayHrs = Math.floor(bdayTotalSec / 3600) % 24;
    
    // Estimate months and remaining days for next birthday
    let bdayMonths = nextBday.getMonth() - comparisonDate.getMonth();
    let bdayDays = nextBday.getDate() - comparisonDate.getDate();

    if (bdayDays < 0) {
      bdayMonths -= 1;
      const prev = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      bdayDays += prev.getDate();
    }
    if (bdayMonths < 0) {
      bdayMonths += 12;
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
    });
  }, [dob, targetDate]);

  // Set up live interval or single calculation
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
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
      title="Age Calculator"
      description="Find your exact age in years, months, weeks, and days. Track your next birthday countdown in real-time."
      howToUse={howToUse}
      faqs={faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 text-left">
        {/* Controls form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Date of Birth</label>
            <Input
              type="date"
              className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Clock className="h-4 w-4" /> Calculate Age at Date</label>
            <Input
              type="date"
              className="h-14 text-lg font-bold rounded-xl border-2 focus:border-primary"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </form>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Main outputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Exact Age Card */}
              <Card className="md:col-span-6 p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-3xl text-center flex flex-col justify-center space-y-3 shadow-sm">
                <div className="text-sm text-muted-foreground font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Hourglass className="h-4 w-4 text-primary" /> Exact Age
                </div>
                <div className="text-4xl sm:text-5xl font-black text-primary tracking-tight">
                  {result.years} <span className="text-xl text-muted-foreground font-normal">years</span>
                </div>
                <div className="text-lg font-bold text-muted-foreground">
                  {result.months} months, {result.days} days
                </div>
                {liveMode && (
                  <span className="text-[10px] text-emerald-500 font-black tracking-widest uppercase flex items-center justify-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Ticking Enabled
                  </span>
                )}
              </Card>

              {/* Next Birthday Card */}
              <Card className="md:col-span-6 p-8 border-none bg-zinc-50 dark:bg-zinc-900 rounded-3xl text-center flex flex-col justify-center space-y-4 shadow-sm">
                <div className="text-sm text-muted-foreground font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Gift className="h-4 w-4 text-primary" /> Next Birthday Countdown
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary font-mono">{result.nextBirthday.months}</div>
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">Mths</div>
                  </div>
                  <div className="text-muted-foreground font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary font-mono">{result.nextBirthday.days}</div>
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">Days</div>
                  </div>
                  <div className="text-muted-foreground font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary font-mono">{result.nextBirthday.hours.toString().padStart(2, "0")}</div>
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">Hrs</div>
                  </div>
                  <div className="text-muted-foreground font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary font-mono">{result.nextBirthday.minutes.toString().padStart(2, "0")}</div>
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">Mins</div>
                  </div>
                  <div className="text-muted-foreground font-bold">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary font-mono">{result.nextBirthday.seconds.toString().padStart(2, "0")}</div>
                    <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-0.5">Secs</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-normal font-medium">
                  {result.nextBirthday.months === 0 && result.nextBirthday.days === 0
                    ? "🎉 Happy Birthday! today is the day!"
                    : `Your birthday is in ${result.nextBirthday.months} months and ${result.nextBirthday.days} days.`}
                </p>
              </Card>
            </div>

            {/* Cumulative stats */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Lived Cumulative Milestones</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalMonths.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Months</div>
                </Card>
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalWeeks.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Weeks</div>
                </Card>
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalDays.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Days</div>
                </Card>
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalHours.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Hours</div>
                </Card>
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalMinutes.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Minutes</div>
                </Card>
                <Card className="p-4 text-center bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl shadow-sm">
                  <div className="text-lg font-black text-primary font-mono truncate">{result.totalSeconds.toLocaleString()}</div>
                  <div className="text-[9px] uppercase font-black text-muted-foreground tracking-wider mt-1">Seconds</div>
                </Card>
              </div>
            </div>
          </div>
        )}

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


