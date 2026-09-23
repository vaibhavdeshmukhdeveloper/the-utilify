"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  TrendingUp, 
  RefreshCw, 
  DollarSign, 
  Calendar, 
  Percent, 
  Settings2, 
  ArrowRight, 
  Download, 
  Share2, 
  Target, 
  Wallet, 
  Clock, 
  Coins
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import dynamic from "next/dynamic";
import { MathFormula } from "@/components/MathFormula";
import { triggerConfetti } from "@/lib/confetti";
import { copyShareUrl } from "@/lib/share-utils";
import { getUIStrings, Locale } from "@/lib/i18n/ui-strings";
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

export type CalculationTarget = "end_amount" | "contribution" | "starting_amount" | "return_rate" | "length";

export interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
  label?: string;
}

export interface InvestmentCalculatorClientProps {
  customTitle?: string;
  customDescription?: string;
  customSummaryDefinition?: string;
  customHowToUse?: { step: string; description: string }[];
  customFaqs?: { question: string; answer: string }[];
  lang?: string;
}

function getPeriodicRate(annualRate: number, compoundFreq: string, contribFreq: string): number {
  const p = contribFreq === "annually" ? 1 : 12;
  let m = 1;
  if (compoundFreq === "daily") m = 365;
  else if (compoundFreq === "monthly") m = 12;
  else if (compoundFreq === "quarterly") m = 4;
  else if (compoundFreq === "semiannually") m = 2;
  else if (compoundFreq === "annually") m = 1;

  if (annualRate === 0) return 0;
  return Math.pow(1 + annualRate / m, m / p) - 1;
}

function calcEndAmount(
  P: number,
  PMT: number,
  t: number,
  annualRate: number,
  compoundFreq: string,
  contribTiming: string,
  contribFreq: string
): number {
  const p = contribFreq === "annually" ? 1 : 12;
  const N = t * p;
  const i = getPeriodicRate(annualRate, compoundFreq, contribFreq);
  const timingFactor = contribTiming === "beginning" ? 1 : 0;

  if (i === 0) {
    return P + PMT * N;
  }

  const F = Math.pow(1 + i, N);
  const S = ((F - 1) / i) * (1 + i * timingFactor);
  return P * F + PMT * S;
}

export default function InvestmentCalculatorClient({
  customTitle,
  customDescription,
  customSummaryDefinition,
  customHowToUse,
  customFaqs,
  lang,
}: InvestmentCalculatorClientProps = {}) {
  const currentLocale = (lang as Locale) || "en";
  const strings = getUIStrings(currentLocale).investmentCalculator;
  const { currency, setCurrency, info: currencyInfo, format: formatCurrency } = useCurrency();

  // Calculation target tab
  const [calculationTarget, setCalculationTarget] = useState<CalculationTarget>("end_amount");

  // Input states
  const [targetAmount, setTargetAmount] = useState("200,000");
  const [initialAmount, setInitialAmount] = useState("20,000");
  const [additionalContribution, setAdditionalContribution] = useState("1,000");
  const [years, setYears] = useState("10");
  const [interestRate, setInterestRate] = useState("6");
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [contributionTiming, setContributionTiming] = useState("end");
  const [contributionFrequency, setContributionFrequency] = useState("monthly");

  const [result, setResult] = useState<{
    targetMode: CalculationTarget;
    mainTitle: string;
    mainValue: string;
    subNote?: string;
    targetBalance: string;
    startingAmount: string;
    totalContributions: string;
    totalInterest: string;
    isLoss: boolean;
    breakdown: YearlyBreakdown[];
    displayYears: string;
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
    setTargetAmount((prev) => formatNumberWithCurrency(parseNumber(prev), currency));
    setInitialAmount((prev) => formatNumberWithCurrency(parseNumber(prev), currency));
    setAdditionalContribution((prev) => {
      const isNeg = prev.startsWith("-");
      const clean = parseNumber(prev.replace(/[^0-9.]/g, ""));
      const formatted = formatNumberWithCurrency(clean, currency);
      return (isNeg ? "-" : "") + formatted;
    });
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

        const targetParam = params.get("target") || params.get("mode") || params.get("calc");
        const goal = params.get("targetAmount") || params.get("goal");
        const init = params.get("initial") || params.get("principal") || params.get("lumpSum");
        const contrib = params.get("contribution") || params.get("monthly") || params.get("pmt");
        const y = params.get("years") || params.get("duration") || params.get("term");
        const r = params.get("rate") || params.get("interest") || params.get("return");
        const compound = params.get("compound") || params.get("freq") || params.get("frequency");
        const timing = params.get("timing");
        const contribFreq = params.get("contribFreq") || params.get("interval");

        if (targetParam && ["end_amount", "contribution", "starting_amount", "return_rate", "length"].includes(targetParam)) {
          setCalculationTarget(targetParam as CalculationTarget);
        }
        if (goal && !isNaN(Number(goal.replace(/,/g, "")))) {
          setTargetAmount(formatNumberWithCurrency(goal.replace(/,/g, ""), currency));
        }
        if (init && !isNaN(Number(init.replace(/,/g, "")))) {
          setInitialAmount(formatNumberWithCurrency(init.replace(/,/g, ""), currency));
        }
        if (contrib && !isNaN(Number(contrib.replace(/,/g, "")))) {
          setAdditionalContribution(formatNumberWithCurrency(contrib.replace(/,/g, ""), currency));
        }
        if (y && !isNaN(Number(y))) {
          setYears(y);
        }
        if (r && !isNaN(Number(r))) {
          setInterestRate(r);
        }
        if (compound && ["annually", "semiannually", "quarterly", "monthly", "daily"].includes(compound)) {
          setCompoundFrequency(compound);
        }
        if (timing && (timing === "beginning" || timing === "end")) {
          setContributionTiming(timing);
        }
        if (contribFreq && (contribFreq === "monthly" || contribFreq === "annually")) {
          setContributionFrequency(contribFreq);
        }
      }

      const stored = localStorage.getItem("utilify-recent-tools");
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const href = "/investment-calculator";
      
      const updatedList = [href, ...currentList.filter((x) => x !== href)].slice(0, 4);
      localStorage.setItem("utilify-recent-tools", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Error setting recently used tools", e);
    }
  }, []);

  // Reactive Multi-Target Calculation Engine
  useEffect(() => {
    const rawTargetAmount = parseFloat(parseNumber(targetAmount));
    const rawInitialAmount = parseFloat(parseNumber(initialAmount)) || 0;
    const rawContribution = parseFloat(parseNumber(additionalContribution)) || 0;
    const rawYears = parseFloat(parseNumber(years)) || 0;
    const rawRate = (parseFloat(parseNumber(interestRate)) || 0) / 100;

    const p = contributionFrequency === "annually" ? 1 : 12;
    const timingFactor = contributionTiming === "beginning" ? 1 : 0;

    let effP = rawInitialAmount;
    let effPMT = rawContribution;
    let effT = rawYears;
    let effRate = rawRate;
    let effFV = 0;

    let mainTitle = "";
    let mainValue = "";
    let subNote = "";

    // Calculation by Target Mode
    if (calculationTarget === "end_amount") {
      if (rawYears <= 0 || (rawInitialAmount === 0 && rawContribution === 0)) {
        setResult(null);
        return;
      }
      effFV = calcEndAmount(effP, effPMT, effT, effRate, compoundFrequency, contributionTiming, contributionFrequency);
      mainTitle = strings.results.totalFutureWealth;
      mainValue = formatCurrency(effFV);
      if (effFV < 0) {
        subNote = "Your portfolio depletes to zero before the end of the duration due to withdrawals exceeding growth.";
      }
    } else if (calculationTarget === "contribution") {
      if (rawYears <= 0 || isNaN(rawTargetAmount) || rawTargetAmount < 0) {
        setResult(null);
        return;
      }
      effFV = rawTargetAmount;
      const N = effT * p;
      const i = getPeriodicRate(effRate, compoundFrequency, contributionFrequency);
      if (i === 0) {
        effPMT = (effFV - effP) / N;
      } else {
        const F = Math.pow(1 + i, N);
        const S = ((F - 1) / i) * (1 + i * timingFactor);
        effPMT = (effFV - effP * F) / S;
      }
      mainTitle = strings.results.neededContribution;
      const freqSuffix = contributionFrequency === "annually" ? ` / ${strings.labels.year}` : ` / ${strings.labels.month}`;
      mainValue = formatCurrency(effPMT) + freqSuffix;
      if (effPMT < 0) {
        subNote = `Your starting deposit exceeds your target. You can withdraw ${formatCurrency(Math.abs(Math.round(effPMT)))}${freqSuffix} while still meeting your target.`;
      }
    } else if (calculationTarget === "starting_amount") {
      if (rawYears <= 0 || isNaN(rawTargetAmount) || rawTargetAmount < 0) {
        setResult(null);
        return;
      }
      effFV = rawTargetAmount;
      const N = effT * p;
      const i = getPeriodicRate(effRate, compoundFrequency, contributionFrequency);
      if (i === 0) {
        effP = effFV - effPMT * N;
      } else {
        const F = Math.pow(1 + i, N);
        const S = ((F - 1) / i) * (1 + i * timingFactor);
        effP = (effFV - effPMT * S) / F;
      }
      mainTitle = strings.results.neededStartingAmount;
      if (effP <= 0) {
        mainValue = formatCurrency(0);
        subNote = `No initial capital required! Your regular contributions alone exceed the target by ${formatCurrency(Math.abs(Math.round(effP)))}.`;
      } else {
        mainValue = formatCurrency(effP);
      }
    } else if (calculationTarget === "return_rate") {
      if (rawYears <= 0 || isNaN(rawTargetAmount) || rawTargetAmount < 0 || (rawInitialAmount === 0 && rawContribution === 0)) {
        setResult(null);
        return;
      }
      effFV = rawTargetAmount;
      // Bisection numerical solver for annual return rate
      let low = -0.99; // -99% minimum return
      let high = 10.0;  // 1000% maximum return

      const testFVLow = calcEndAmount(effP, effPMT, effT, low, compoundFrequency, contributionTiming, contributionFrequency);
      const testFVHigh = calcEndAmount(effP, effPMT, effT, high, compoundFrequency, contributionTiming, contributionFrequency);

      if (effFV < testFVLow) {
        mainTitle = strings.results.neededReturnRate;
        mainValue = "<-99%";
        subNote = "Target requires a capital loss exceeding 99%.";
        effRate = -0.99;
      } else if (effFV > testFVHigh) {
        mainTitle = strings.results.neededReturnRate;
        mainValue = ">1000%";
        subNote = "Target requires an annualized return exceeding 1000%.";
        effRate = 10.0;
      } else {
        for (let iter = 0; iter < 100; iter++) {
          const mid = (low + high) / 2;
          const testFV = calcEndAmount(effP, effPMT, effT, mid, compoundFrequency, contributionTiming, contributionFrequency);
          if (testFV < effFV) {
            low = mid;
          } else {
            high = mid;
          }
        }
        effRate = (low + high) / 2;
        mainTitle = strings.results.neededReturnRate;
        mainValue = (effRate * 100).toFixed(2) + "%";
        if (effRate < 0) {
          subNote = "A negative return (capital drawdown) is required because total deposits exceed your target.";
        }
      }
    } else if (calculationTarget === "length") {
      if (isNaN(rawTargetAmount) || rawTargetAmount < 0 || (rawInitialAmount === 0 && rawContribution === 0)) {
        setResult(null);
        return;
      }
      effFV = rawTargetAmount;
      const i = getPeriodicRate(effRate, compoundFrequency, contributionFrequency);

      // Scenario 1: Target already met and not withdrawing
      if (effP >= effFV && effPMT >= 0) {
        effT = 0;
        mainTitle = strings.results.neededLength;
        mainValue = "0 " + strings.results.yearsOnly(0);
        subNote = "Your starting capital already meets or exceeds your target amount.";
      } 
      // Scenario 2: Zero interest rate
      else if (effRate === 0 || i === 0) {
        if (effPMT === 0) {
          mainTitle = strings.results.neededLength;
          mainValue = "Unreachable";
          subNote = "Without growth or contributions, the target cannot be reached.";
          effT = 0;
        } else {
          const N = (effFV - effP) / effPMT;
          if (N < 0) {
            mainTitle = strings.results.neededLength;
            mainValue = "Unreachable";
            subNote = effPMT < 0
              ? "Target cannot be reached because withdrawals are depleting the balance."
              : "Target cannot be reached with the current parameters.";
            effT = 0;
          } else {
            effT = N / p;
            const decimalYears = effT.toFixed(3);
            const totalMonths = effT * 12;
            const wholeY = Math.floor(effT);
            const remM = Number((totalMonths - wholeY * 12).toFixed(1));
            const isWholeYear = Math.abs(effT - Math.round(effT)) < 0.001;

            mainTitle = strings.results.neededLength;
            if (isWholeYear) {
              mainValue = strings.results.yearsOnly(Math.round(effT));
            } else {
              mainValue = `${decimalYears} Years`;
              const yStr = wholeY === 1 ? "1 Year" : `${wholeY} Years`;
              const mStr = `${remM} Months`;
              subNote = `${wholeY > 0 ? `${yStr} and ${mStr}` : mStr} (${totalMonths.toFixed(1)} Months)`;
            }
          }
        }
      } 
      // Scenario 3: Lump sum only (no periodic additions/withdrawals)
      else if (effPMT === 0) {
        if (effFV > effP) {
          const N = Math.log(effFV / effP) / Math.log(1 + i);
          effT = N / p;
          const decimalYears = effT.toFixed(3);
          const totalMonths = effT * 12;
          const wholeY = Math.floor(effT);
          const remM = Number((totalMonths - wholeY * 12).toFixed(1));
          const isWholeYear = Math.abs(effT - Math.round(effT)) < 0.001;

          mainTitle = strings.results.neededLength;
          if (effT > 100) {
            mainValue = "100+ " + strings.results.yearsOnly(100);
            subNote = "Target horizon exceeds 100 years at the current return rate.";
            effT = 100;
          } else if (isWholeYear) {
            mainValue = strings.results.yearsOnly(Math.round(effT));
          } else {
            mainValue = `${decimalYears} Years`;
            const yStr = wholeY === 1 ? "1 Year" : `${wholeY} Years`;
            const mStr = `${remM} Months`;
            subNote = `${wholeY > 0 ? `${yStr} and ${mStr}` : mStr} (${totalMonths.toFixed(1)} Months)`;
          }
        } else {
          mainTitle = strings.results.neededLength;
          mainValue = "N/A";
          subNote = "With positive returns and no withdrawals, the balance only increases.";
          effT = 0;
        }
      } 
      // Scenario 4: Periodic contribution or withdrawal with compounding
      else {
        const A = (effPMT * (1 + i * timingFactor)) / i;

        // Subcase 4A: Depletion / Drawdown (effFV < effP and effPMT < 0)
        if (effFV < effP && effPMT < 0) {
          // If principal growth exceeds or equals withdrawal rate, fund is perpetual
          if (effP + A >= 0) {
            mainTitle = strings.results.neededLength;
            mainValue = "Perpetual Fund";
            subNote = "Your portfolio generates more in investment returns than you withdraw, so the balance will never deplete to your target.";
            effT = 0;
          } else {
            // Withdrawals exceed growth; balance steadily draws down to effFV
            const ratio = (effFV + A) / (effP + A);
            if (ratio <= 0) {
              mainTitle = strings.results.neededLength;
              mainValue = "Unreachable";
              subNote = "Target cannot be reached under the current withdrawal and return parameters.";
              effT = 0;
            } else {
              const N = Math.log(ratio) / Math.log(1 + i);
              effT = N / p;
              const decimalYears = effT.toFixed(3);
              const totalMonths = effT * 12;
              const wholeY = Math.floor(effT);
              const remM = Number((totalMonths - wholeY * 12).toFixed(1));
              const isWholeYear = Math.abs(effT - Math.round(effT)) < 0.001;

              mainTitle = strings.results.neededLength;
              if (effT > 100) {
                mainValue = "100+ " + strings.results.yearsOnly(100);
                subNote = "Target horizon exceeds 100 years at current withdrawal and return rate.";
                effT = 100;
              } else if (isWholeYear) {
                mainValue = strings.results.yearsOnly(Math.round(effT));
              } else {
                mainValue = `${decimalYears} Years`;
                const yStr = wholeY === 1 ? "1 Year" : `${wholeY} Years`;
                const mStr = `${remM} Months`;
                subNote = `${wholeY > 0 ? `${yStr} and ${mStr}` : mStr} (${totalMonths.toFixed(1)} Months)`;
              }
            }
          }
        } 
        // Subcase 4B: Attempting to grow with withdrawals (effFV > effP and effPMT < 0)
        else if (effFV > effP && effPMT < 0) {
          if (effP + A <= 0) {
            mainTitle = strings.results.neededLength;
            mainValue = "Unreachable";
            subNote = "Target cannot be reached because periodic withdrawals exceed portfolio investment growth.";
            effT = 0;
          } else {
            const ratio = (effFV + A) / (effP + A);
            if (ratio <= 0) {
              mainTitle = strings.results.neededLength;
              mainValue = "Unreachable";
              effT = 0;
            } else {
              const N = Math.log(ratio) / Math.log(1 + i);
              effT = N / p;
              const decimalYears = effT.toFixed(3);
              const totalMonths = effT * 12;
              const wholeY = Math.floor(effT);
              const remM = Number((totalMonths - wholeY * 12).toFixed(1));
              const isWholeYear = Math.abs(effT - Math.round(effT)) < 0.001;

              mainTitle = strings.results.neededLength;
              if (effT > 100) {
                mainValue = "100+ " + strings.results.yearsOnly(100);
                subNote = "Target horizon exceeds 100 years.";
                effT = 100;
              } else if (isWholeYear) {
                mainValue = strings.results.yearsOnly(Math.round(effT));
              } else {
                mainValue = `${decimalYears} Years`;
                const yStr = wholeY === 1 ? "1 Year" : `${wholeY} Years`;
                const mStr = `${remM} Months`;
                subNote = `${wholeY > 0 ? `${yStr} and ${mStr}` : mStr} (${totalMonths.toFixed(1)} Months)`;
              }
            }
          }
        }
        // Subcase 4C: Standard accumulation (effFV > effP and effPMT > 0)
        else {
          const ratio = (effFV + A) / (effP + A);
          if (ratio <= 0) {
            setResult(null);
            return;
          }
          const N = Math.log(ratio) / Math.log(1 + i);
          effT = N / p;

          if (effT > 100) {
            mainTitle = strings.results.neededLength;
            mainValue = "100+ " + strings.results.yearsOnly(100);
            subNote = "Target horizon exceeds 100 years at the current contribution and return rate.";
            effT = 100;
          } else {
            const decimalYears = effT.toFixed(3);
            const totalMonths = effT * 12;
            const wholeY = Math.floor(effT);
            const remM = Number((totalMonths - wholeY * 12).toFixed(1));
            const isWholeYear = Math.abs(effT - Math.round(effT)) < 0.001;

            mainTitle = strings.results.neededLength;
            if (isWholeYear) {
              mainValue = strings.results.yearsOnly(Math.round(effT));
            } else {
              mainValue = `${decimalYears} Years`;
              const yStr = wholeY === 1 ? "1 Year" : `${wholeY} Years`;
              const mStr = `${remM} Months`;
              subNote = `${wholeY > 0 ? `${yStr} and ${mStr}` : mStr} (${totalMonths.toFixed(1)} Months)`;
            }
          }
        }
      }
    }

    // Build accumulation schedule and breakdown
    const breakdown: YearlyBreakdown[] = [];

    if (effT <= 0) {
      breakdown.push({
        year: 0,
        principal: effP,
        interest: 0,
        balance: effP,
        label: "Starting Capital",
      });
    } else {
      for (let year = 1; year <= Math.floor(effT); year++) {
        const balanceAtYear = calcEndAmount(effP, effPMT, year, effRate, compoundFrequency, contributionTiming, contributionFrequency);
        const principalAtYear = effP + effPMT * (year * p);
        breakdown.push({
          year,
          principal: principalAtYear,
          interest: balanceAtYear - principalAtYear,
          balance: balanceAtYear,
          label: `Year ${year}`,
        });
      }

      // If fractional year exists in length mode or custom duration
      const hasFractionalYear = effT > Math.floor(effT) && effT <= 100;
      if (hasFractionalYear) {
        const finalMonths = Math.round(effT * 12 * 10) / 10;
        const finalY = Math.floor(effT);
        const finalM = Number((finalMonths - finalY * 12).toFixed(1));
        const finalLabel = finalM > 0 ? `Yr ${finalY} (Mo ${finalM})` : `Year ${finalY}`;
        const finalPrincipal = effP + effPMT * (effT * p);
        breakdown.push({
          year: Number(effT.toFixed(2)),
          principal: finalPrincipal,
          interest: effFV - finalPrincipal,
          balance: effFV,
          label: finalLabel,
        });
      }
    }

    const totalPrincipalDeposited = effP + effPMT * (effT * p);
    const totalInterestEarned = effFV - totalPrincipalDeposited;

    setResult({
      targetMode: calculationTarget,
      mainTitle,
      mainValue,
      subNote,
      targetBalance: formatCurrencyValue(effFV, currency, { showSymbol: false }),
      startingAmount: formatCurrencyValue(effP, currency, { showSymbol: false }),
      totalContributions: formatCurrencyValue(effPMT * (effT * p), currency, { showSymbol: false }),
      totalInterest: formatCurrencyValue(totalInterestEarned, currency, { showSymbol: false }),
      isLoss: totalInterestEarned < 0,
      breakdown,
      displayYears: effT.toFixed(1),
    });
  }, [
    calculationTarget,
    targetAmount,
    initialAmount,
    additionalContribution,
    years,
    interestRate,
    compoundFrequency,
    contributionTiming,
    contributionFrequency,
    currency,
    formatCurrency,
    strings,
  ]);

  const calculateInvestment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerConfetti();

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.success("Investment Plan Projected!");
  };

  const reset = () => {
    setTargetAmount("200,000");
    setInitialAmount("20,000");
    setAdditionalContribution("1,000");
    setYears("10");
    setInterestRate("6");
    setCompoundFrequency("annually");
    setContributionTiming("end");
    setContributionFrequency("monthly");
  };

  const exportToCsv = () => {
    if (!result || result.breakdown.length === 0) return;
    const sym = currencyInfo.symbol;
    const headers = ["Period", `Invested Principal (${sym})`, `Interest Earned (${sym})`, `Total Balance (${sym})`];
    const rows = result.breakdown.map((row) => [
      row.label || `Year ${row.year}`,
      Math.round(row.principal),
      Math.round(row.interest),
      Math.round(row.balance)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `investment_${calculationTarget}_projection.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported accumulation schedule to CSV!");
  };

  const currentMathFormula = useMemo(() => {
    switch (calculationTarget) {
      case "contribution":
        return "\\text{PMT} = \\frac{\\text{FV} - P \\left(1 + \\frac{r}{m}\\right)^{mt}}{\\left[ \\frac{\\left(1 + \\frac{r}{m}\\right)^{mt} - 1}{\\left(1 + \\frac{r}{m}\\right)^{m/p} - 1} \\right] \\times (1 + i \\cdot \\text{timingFactor})}";
      case "starting_amount":
        return "P = \\frac{\\text{FV} - \\text{PMT} \\times \\left[ \\frac{\\left(1 + \\frac{r}{m}\\right)^{mt} - 1}{\\left(1 + \\frac{r}{m}\\right)^{m/p} - 1} \\right] \\times (1 + i \\cdot \\text{timingFactor})}{\\left(1 + \\frac{r}{m}\\right)^{mt}}";
      case "return_rate":
        return "\\text{Find } r \\text{ such that: } \\text{FV}(r) = P \\left(1 + \\frac{r}{m}\\right)^{mt} + \\text{PMT} \\times \\text{FVIFA}(r, m, p, t) = \\text{Target FV}";
      case "length":
        return "t = \\frac{\\ln\\left( \\frac{\\text{FV} + A}{P + A} \\right)}{p \\cdot \\ln(1 + i)}, \\quad \\text{where } A = \\frac{\\text{PMT} \\times (1 + i \\cdot \\text{timingFactor})}{i}";
      case "end_amount":
      default:
        return "A = P \\left(1 + \\frac{r}{m}\\right)^{mt} + \\text{PMT} \\times \\left[ \\frac{\\left(1 + \\frac{r}{m}\\right)^{mt} - 1}{\\left(1 + \\frac{r}{m}\\right)^{m/p} - 1} \\right] \\times (1 + i \\cdot \\text{timingFactor})";
    }
  }, [calculationTarget]);

  const howToUse = [
    { 
      step: "Select Calculation Goal", 
      description: "Choose whether you want to solve for End Wealth, Required Contribution, Initial Capital, Return Rate, or Investment Length." 
    },
    { 
      step: "Set Portfolio Values", 
      description: "Input your target financial metrics such as starting lump sum, duration in years, periodic additions, or target goal." 
    },
    { 
      step: "Fine-Tune Compounding", 
      description: "Select daily, monthly, quarterly, semiannual, or annual compounding frequencies and contribution timing (beginning or end)." 
    },
    { 
      step: "Analyze Trajectory", 
      description: "Explore interactive growth curves, donut asset breakdowns, annual schedules, and export high-resolution CSVs." 
    }
  ];

  const faqs = [
    { 
      question: "What calculation modes are supported in this Investment Calculator?", 
      answer: "The calculator supports 5 versatile targets matching professional financial planners: 1) End Amount (future value), 2) Additional Contribution (savings needed per month/year), 3) Starting Amount (initial deposit needed), 4) Return Rate (required annualized CAGR), and 5) Invest Length (time required to hit your target)."
    },
    { 
      question: "What is the difference between this and the SIP Calculator?", 
      answer: "The Investment Calculator is a comprehensive multi-variable suite. It models scenarios starting with substantial upfront lump sums compounded alongside recurring additions across custom compounding frequencies (daily, monthly, quarterly, semiannually, annually), whereas a standard SIP calculator models recurring monthly savings starting from zero."
    },
    { 
      question: "How does compounding frequency affect investment returns?", 
      answer: "The more frequently interest compounds within a year, the higher the effective annual return. Daily compounding produces slightly higher growth than monthly, which in turn outperforms quarterly and annual compounding due to interest earning interest sooner."
    },
    { 
      question: "What is the difference between Beginning and End contribution timing?", 
      answer: "Contributing at the beginning of each period (annuity due) gives each deposit an extra interval of compound growth, resulting in a higher ending balance compared to contributing at the end of the period (ordinary annuity)."
    }
  ];

  const relatedTools = [
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "FIRE Calculator", href: "/fire-calculator" },
    { name: "Date Calculator", href: "/date-calculator" }
  ];

  const detailedContent = (
    <article className="space-y-6">
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
        <h4 className="font-bold text-base mb-2 text-amber-800 dark:text-amber-300">Important Financial Disclaimer</h4>
        <p className="text-sm leading-relaxed m-0">
          This Investment Growth Calculator is designed strictly for informational, educational, and financial simulation purposes. Projections represent idealized mathematical compounding and do not account for taxes, management fees, inflation, or market volatility. It does not constitute certified investment advice or personalized portfolio recommendations.
        </p>
      </div>

      <h3>Universal Multi-Mode Investment Modeling</h3>
      <p>
        Real-world investment planning requires flexibility: sometimes you know your final wealth goal and need to discover how much to save monthly, what initial principal is required, or what annualized rate of return is necessary to reach financial freedom. This tool solves all five key financial variables algebraically and through high-precision numerical algorithms.
      </p>

      <h4>Active Mode Mathematical Formula</h4>
      <p>
        Based on your currently selected calculation target (<strong>{strings.tabs[calculationTarget === "end_amount" ? "endAmount" : calculationTarget === "contribution" ? "contribution" : calculationTarget === "starting_amount" ? "startingAmount" : calculationTarget === "return_rate" ? "returnRate" : "length"]}</strong>), the model computes:
      </p>
      <div className="my-4 p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-inner flex flex-col items-center justify-center overflow-x-auto">
        <MathFormula formula={currentMathFormula} />
      </div>

      <p>Where:</p>
      <ul>
        <li><strong>FV:</strong> Total accumulated future wealth balance.</li>
        <li><strong>P:</strong> Initial starting deposit (Principal).</li>
        <li><strong>PMT:</strong> Periodic recurring contribution per interval (monthly or annual).</li>
        <li><strong>r:</strong> Nominal annual interest rate (in decimal form).</li>
        <li><strong>m:</strong> Compounding frequency per year ($365$ for daily, $12$ for monthly, $4$ for quarterly, $2$ for semiannual, $1$ for annual).</li>
        <li><strong>p:</strong> Deposit frequency per year ($12$ for monthly, $1$ for annual).</li>
        <li><strong>t:</strong> Total investment duration in years.</li>
        <li><strong>i:</strong> Effective interest rate per deposit interval: <MathFormula formula="i = \left(1 + \frac{r}{m}\right)^{m/p} - 1" displayMode={false} className="inline-block" /></li>
        <li><strong>timingFactor:</strong> 1 when contributing at the beginning of the period, or 0 when contributing at the end.</li>
      </ul>
    </article>
  );

  return (
    <ToolLayout
      title={customTitle || "Investment Calculator"}
      description={customDescription || "Universal compound interest planner: calculate end amount, required contribution, starting capital, return rate, or time horizon."}
      summaryDefinition={customSummaryDefinition || "An investment growth calculator determines any key parameter of an investment plan—end wealth, necessary periodic contribution, initial lump-sum capital, required annual return rate, or time horizon—with customizable compounding frequencies and timing."}
      howToUse={customHowToUse || howToUse}
      faqs={customFaqs || faqs}
      relatedTools={relatedTools}
      detailedContent={detailedContent}
    >
      <div className="w-full max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Control Bar: Segmented Mode Switcher + Currency Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 shadow-xs flex-1">
            {[
              { id: "end_amount" as CalculationTarget, label: strings.tabs.endAmount, icon: TrendingUp },
              { id: "contribution" as CalculationTarget, label: strings.tabs.contribution, icon: DollarSign },
              { id: "starting_amount" as CalculationTarget, label: strings.tabs.startingAmount, icon: Wallet },
              { id: "return_rate" as CalculationTarget, label: strings.tabs.returnRate, icon: Percent },
              { id: "length" as CalculationTarget, label: strings.tabs.length, icon: Calendar },
            ].map((tab) => {
              const isActive = calculationTarget === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCalculationTarget(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-primary shadow-xs font-black border border-zinc-200 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between md:justify-end shrink-0 gap-2">
            <span className="text-xs text-muted-foreground font-bold">Currency:</span>
            <CurrencySelector value={currency} onChange={setCurrency} size="default" />
          </div>
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-4">
            <form onSubmit={calculateInvestment} className="space-y-4">
              <Card className="p-4 sm:p-5 space-y-3.5 border-2 shadow-xs rounded-2xl">
                {/* Field 1: Target Amount (Shown when NOT solving for end_amount) */}
                {calculationTarget !== "end_amount" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5" /> {strings.labels.targetAmount}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        {currencyInfo.symbol}
                      </span>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        className="h-11 pl-7 pr-3 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-primary/5 dark:bg-primary/10 border-primary/30"
                        value={targetAmount} 
                        onChange={handleInputChange(setTargetAmount)} 
                      />
                    </div>
                  </div>
                )}

                {/* Field 2: Starting Capital (Shown when NOT solving for starting_amount) */}
                {calculationTarget !== "starting_amount" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5" /> {strings.labels.startingAmount}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        {currencyInfo.symbol}
                      </span>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        className="h-11 pl-7 pr-3 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                        value={initialAmount} 
                        onChange={handleInputChange(setInitialAmount)} 
                      />
                    </div>
                  </div>
                )}

                {/* Field 3: Additional Contribution (Shown when NOT solving for contribution) */}
                {calculationTarget !== "contribution" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" /> {strings.labels.additionalContribution}
                      </Label>
                      <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => {
                            const num = Math.abs(parseFloat(parseNumber(additionalContribution)) || 0);
                            setAdditionalContribution(formatNumber(String(num)));
                          }}
                          className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                            !additionalContribution.startsWith("-")
                              ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          + Deposit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const num = Math.abs(parseFloat(parseNumber(additionalContribution)) || 0);
                            if (num > 0) {
                              setAdditionalContribution("-" + formatNumber(String(num)));
                            } else {
                              setAdditionalContribution("-");
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                            additionalContribution.startsWith("-")
                              ? "bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow-xs font-bold"
                              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          − Withdraw
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        {currencyInfo.symbol}
                      </span>
                      <Input 
                        type="text" 
                        inputMode="numeric"
                        className="h-11 pl-7 pr-3 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                        value={additionalContribution} 
                        onChange={handleInputChange(setAdditionalContribution)} 
                      />
                    </div>
                  </div>
                )}

                {/* Field 4 & 5: Duration and Rate (Side-by-side in grid for high density) */}
                <div className={`grid ${calculationTarget === "length" || calculationTarget === "return_rate" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
                  {calculationTarget !== "length" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {strings.labels.durationYears}
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
                          { label: "30Y", val: "30" },
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
                  )}

                  {calculationTarget !== "return_rate" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Percent className="h-3.5 w-3.5" /> {strings.labels.returnRate}
                      </Label>
                      <Input 
                        type="text" 
                        inputMode="decimal"
                        className="h-11 text-lg font-bold rounded-xl border-2 focus:border-primary transition-all bg-zinc-50/50 dark:bg-zinc-900/50"
                        value={interestRate} 
                        onChange={handleInputChange(setInterestRate)} 
                      />
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {[
                          { label: "4%", val: "4" },
                          { label: "7%", val: "7" },
                          { label: "10%", val: "10" },
                          { label: "12%", val: "12" },
                        ].map((chip) => (
                          <button
                            key={chip.val}
                            type="button"
                            onClick={() => setInterestRate(chip.val)}
                            className={`text-[10px] px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                              interestRate === chip.val
                                ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                                : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced Compounding & Timing Settings */}
                <div className="pt-3 border-t space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
                    <Settings2 className="h-3.5 w-3.5" /> {strings.labels.advancedSettings}
                  </div>
                  
                  {/* Compounding Interval Select */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase text-muted-foreground">{strings.labels.compoundInterval}</Label>
                    <Select value={compoundFrequency} onValueChange={(val) => val && setCompoundFrequency(val)}>
                      <SelectTrigger className="h-10 rounded-xl border-2 font-medium text-xs sm:text-sm">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annually">{strings.labels.frequencies.annually}</SelectItem>
                        <SelectItem value="semiannually">{strings.labels.frequencies.semiannually}</SelectItem>
                        <SelectItem value="quarterly">{strings.labels.frequencies.quarterly}</SelectItem>
                        <SelectItem value="monthly">{strings.labels.frequencies.monthly}</SelectItem>
                        <SelectItem value="daily">{strings.labels.frequencies.daily}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contribution Timing & Period */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">{strings.labels.contributionTiming}</Label>
                      <RadioGroup value={contributionTiming} onValueChange={setContributionTiming} className="flex gap-4">
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="beginning" id="beginning" />
                          <Label htmlFor="beginning" className="text-xs font-medium cursor-pointer capitalize">{strings.labels.beginning}</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="end" id="end" />
                          <Label htmlFor="end" className="text-xs font-medium cursor-pointer capitalize">{strings.labels.end}</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold uppercase text-muted-foreground">{strings.labels.ofEach}</Label>
                      <RadioGroup value={contributionFrequency} onValueChange={setContributionFrequency} className="flex gap-4">
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="text-xs font-medium cursor-pointer capitalize">{strings.labels.month}</Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="annually" id="annually" />
                          <Label htmlFor="annually" className="text-xs font-medium cursor-pointer capitalize">{strings.labels.year}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit & Reset CTAs */}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 h-12 text-base font-black shadow-md hover:shadow-lg transition-all rounded-xl">
                  <TrendingUp className="mr-2 h-5 w-5" /> {strings.labels.projectWealthButton}
                </Button>
                <Button type="button" onClick={reset} variant="outline" className="h-12 px-4 rounded-xl border-2" title={strings.labels.resetButton}>
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Results, Charts & Accumulation Schedule */}
          <div ref={resultsRef} className="lg:col-span-7 space-y-5 scroll-mt-24">
            {result ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Main Hero Result Card */}
                <Card className="p-6 sm:p-7 bg-zinc-950 text-zinc-50 border-none shadow-xl rounded-2xl sm:rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <TrendingUp className="h-28 w-28" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">
                      {result.mainTitle}
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3">
                      {result.mainValue}
                    </div>
                    {result.subNote && (
                      <p className="text-xs sm:text-sm text-amber-400 font-medium mb-4">
                        {result.subNote}
                      </p>
                    )}
                    
                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-zinc-800/80">
                      {calculationTarget !== "end_amount" && (
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">
                            {strings.results.targetBalance}
                          </div>
                          <div className="text-base sm:text-lg font-bold text-white">
                            {currencyInfo.symbol}{result.targetBalance}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">
                          {strings.results.startingPrincipal}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white">
                          {currencyInfo.symbol}{result.startingAmount}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">
                          {parseFloat(result.totalContributions.replace(/,/g, "")) < 0 ? "Withdrawals" : strings.results.totalContributions}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white">
                          {currencyInfo.symbol}{result.totalContributions.replace("-", "")}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-0.5">
                          {result.isLoss ? strings.results.totalLoss : strings.results.totalInterest}
                        </div>
                        <div className={`text-base sm:text-lg font-bold ${result.isLoss ? "text-red-400" : "text-emerald-400"}`}>
                          {result.isLoss ? `-${currencyInfo.symbol}${result.totalInterest.replace("-", "")}` : `+${currencyInfo.symbol}${result.totalInterest}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Visual Charts Stack */}
                <div className="flex flex-col gap-4 w-full">
                  <DonutChart 
                    currencyCode={currency}
                    invested={(parseFloat(result.startingAmount.replace(/,/g, "")) || 0) + (parseFloat(result.totalContributions.replace(/,/g, "")) || 0)} 
                    returns={parseFloat(result.totalInterest.replace(/,/g, "")) || 0} 
                  />
                  <GrowthChart currencyCode={currency} breakdown={result.breakdown} />
                </div>

                {/* Yearly Breakdown Table */}
                <Card className="overflow-hidden border shadow-sm rounded-2xl">
                  <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-900 border-b flex flex-wrap gap-3 items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black tracking-tight">{strings.results.yearlyBreakdownTitle}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {strings.results.projectionFor(result.displayYears)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => copyShareUrl({
                          target: calculationTarget,
                          targetAmount: parseNumber(targetAmount),
                          initial: parseNumber(initialAmount),
                          contribution: parseNumber(additionalContribution),
                          years: parseNumber(years),
                          rate: parseNumber(interestRate),
                          compound: compoundFrequency !== "annually" ? compoundFrequency : undefined,
                          timing: contributionTiming !== "end" ? contributionTiming : undefined,
                          contribFreq: contributionFrequency !== "monthly" ? contributionFrequency : undefined,
                          currency: currency !== "USD" ? currency : undefined,
                        }, "Investment Calculation")} 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border font-bold h-9 shrink-0 text-primary border-primary/30 hover:bg-primary/5 text-xs"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> {strings.results.shareLink}
                      </Button>
                      <Button 
                        onClick={exportToCsv} 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border font-bold h-9 shrink-0 text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" /> {strings.results.exportCsv}
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[420px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-background/95 backdrop-blur z-20">
                        <tr className="bg-zinc-100/50 dark:bg-zinc-800/50">
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Period</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Principal</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b">Interest</th>
                          <th className="p-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground border-b text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {result.breakdown.map((row, idx) => {
                          const isIntNeg = row.interest < 0;
                          const prinStr = formatCurrencyValue(row.principal, currency);
                          const intStr = (row.interest >= 0 ? "+" : "") + formatCurrencyValue(row.interest, currency);
                          const balStr = formatCurrencyValue(row.balance, currency);
                          return (
                            <tr key={idx} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="p-3.5 font-bold text-xs sm:text-sm text-primary">{row.label || `Year ${row.year}`}</td>
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
              </div>
            ) : (
              <Card className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center border-dashed border-2 bg-card rounded-2xl sm:rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-1.5">{strings.results.readyToPlanTitle}</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-xs sm:text-sm leading-relaxed">
                  {strings.results.readyToPlanDesc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
                  <ArrowRight className="h-4 w-4" /> {strings.results.startPrompt}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
