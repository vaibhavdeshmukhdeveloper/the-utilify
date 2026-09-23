"use client";

import { useState, useEffect, useCallback } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN", flag: "🇮🇳" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar", locale: "en-CA", flag: "🇨🇦" },
  { code: "AUD", symbol: "$", name: "Australian Dollar", locale: "en-AU", flag: "🇦🇺" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP", flag: "🇯🇵" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH", flag: "🇨🇭" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN", flag: "🇨🇳" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR", flag: "🇧🇷" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", locale: "es-MX", flag: "🇲🇽" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar", locale: "en-SG", flag: "🇸🇬" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", locale: "ar-AE", flag: "🇦🇪" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", locale: "ar-SA", flag: "🇸🇦" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", locale: "ko-KR", flag: "🇰🇷" },
  { code: "NZD", symbol: "$", name: "New Zealand Dollar", locale: "en-NZ", flag: "🇳🇿" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA", flag: "🇿🇦" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR", flag: "🇹🇷" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE", flag: "🇸🇪" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO", flag: "🇳🇴" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK", flag: "🇩🇰" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", locale: "pl-PL", flag: "🇵🇱" },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel", locale: "he-IL", flag: "🇮🇱" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "zh-HK", flag: "🇭🇰" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar", locale: "zh-TW", flag: "🇹🇼" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY", flag: "🇲🇾" },
  { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH", flag: "🇹🇭" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID", flag: "🇮🇩" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH", flag: "🇵🇭" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN", flag: "🇻🇳" },
  { code: "PKR", symbol: "Rs", name: "Pakistani Rupee", locale: "ur-PK", flag: "🇵🇰" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD", flag: "🇧🇩" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG", flag: "🇳🇬" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", locale: "ar-EG", flag: "🇪🇬" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", locale: "es-CL", flag: "🇨🇱" },
  { code: "COP", symbol: "$", name: "Colombian Peso", locale: "es-CO", flag: "🇨🇴" },
];

const STORAGE_KEY = "theutilify_preferred_currency";

/**
 * 100% Client-Side, Privacy-Preserving Currency Detection.
 * Uses browser timeZone and navigator.language without any server calls or IP lookups.
 */
export function detectClientCurrency(): string {
  if (typeof window === "undefined") return "USD";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    // Indian subcontinent
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "INR";
    if (tz.includes("Karachi")) return "PKR";
    if (tz.includes("Dhaka")) return "BDT";
    if (tz.includes("Kathmandu")) return "NPR";
    if (tz.includes("Colombo")) return "LKR";

    // UK & Europe
    if (tz.includes("London")) return "GBP";
    if (tz.startsWith("Europe/")) {
      if (tz.includes("Zurich")) return "CHF";
      if (tz.includes("Stockholm")) return "SEK";
      if (tz.includes("Oslo")) return "NOK";
      if (tz.includes("Copenhagen")) return "DKK";
      if (tz.includes("Warsaw")) return "PLN";
      if (tz.includes("Istanbul")) return "TRY";
      return "EUR";
    }

    // Americas
    if (tz.includes("Sao_Paulo") || tz.includes("Fortaleza") || tz.includes("Recife") || tz.includes("Manaus")) return "BRL";
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal") || tz.includes("Edmonton")) return "CAD";
    if (tz.includes("Mexico_City") || tz.includes("Monterrey") || tz.includes("Tijuana") || tz.includes("Cancun")) return "MXN";
    if (tz.includes("Santiago")) return "CLP";
    if (tz.includes("Bogota")) return "COP";

    // Asia-Pacific & Middle East
    if (tz.includes("Tokyo")) return "JPY";
    if (tz.startsWith("Australia/")) return "AUD";
    if (tz.includes("Auckland")) return "NZD";
    if (tz.includes("Singapore")) return "SGD";
    if (tz.includes("Hong_Kong")) return "HKD";
    if (tz.includes("Taipei")) return "TWD";
    if (tz.includes("Seoul")) return "KRW";
    if (tz.includes("Jakarta")) return "IDR";
    if (tz.includes("Bangkok")) return "THB";
    if (tz.includes("Manila")) return "PHP";
    if (tz.includes("Kuala_Lumpur")) return "MYR";
    if (tz.includes("Ho_Chi_Minh")) return "VND";
    if (tz.includes("Dubai")) return "AED";
    if (tz.includes("Riyadh")) return "SAR";
    if (tz.includes("Jerusalem") || tz.includes("Tel_Aviv")) return "ILS";
    if (tz.includes("Cairo")) return "EGP";
    if (tz.includes("Johannesburg")) return "ZAR";
    if (tz.includes("Lagos")) return "NGN";

    // Secondary fallback: navigator.language
    const navLang = navigator.language || "";
    if (navLang.endsWith("-IN") || /^hi\b|^mr\b|^ta\b|^te\b|^gu\b|^bn-IN\b/.test(navLang)) return "INR";
    if (navLang.endsWith("-GB")) return "GBP";
    if (navLang.endsWith("-BR")) return "BRL";
    if (navLang.endsWith("-CA")) return "CAD";
    if (navLang.endsWith("-AU")) return "AUD";
    if (navLang.endsWith("-JP")) return "JPY";
    if (navLang.endsWith("-DE") || navLang.endsWith("-FR") || navLang.endsWith("-ES") || navLang.endsWith("-IT")) return "EUR";
  } catch {
    // fallback gracefully
  }
  return "USD";
}

export function getStoredCurrency(): string {
  if (typeof window === "undefined") return "USD";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored.toUpperCase();
  } catch {
    // ignore
  }
  return detectClientCurrency();
}

export function setStoredCurrency(code: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, code.toUpperCase());
    window.dispatchEvent(new CustomEvent("theutilify:currency-change", { detail: code.toUpperCase() }));
  } catch {
    // ignore
  }
}

export function getCurrencyInfo(code: string): CurrencyInfo {
  const upper = (code || "USD").toUpperCase();
  return (
    POPULAR_CURRENCIES.find((c) => c.code === upper) || {
      code: upper,
      symbol: upper,
      name: upper,
      locale: "en-US",
      flag: "🌐",
    }
  );
}

/**
 * Formats a currency value with the appropriate symbol and numbering system (Indian vs Western).
 */
export function formatCurrencyValue(
  val: number,
  currencyCode: string = "USD",
  options?: { maximumFractionDigits?: number; showSymbol?: boolean }
): string {
  const isNeg = val < 0;
  const abs = Math.abs(val);
  const maxDigits = options?.maximumFractionDigits ?? 0;
  const showSymbol = options?.showSymbol ?? true;
  const info = getCurrencyInfo(currencyCode);

  let numFormatted = "";
  if (info.code === "INR") {
    // Indian numbering format: 1,00,000 (Lakh) and 1,00,00,000 (Crore)
    const rounded = maxDigits > 0 ? abs.toFixed(maxDigits) : Math.round(abs).toString();
    const parts = rounded.split(".");
    let intPart = parts[0];
    if (intPart.length > 3) {
      const last3 = intPart.substring(intPart.length - 3);
      const rest = intPart.substring(0, intPart.length - 3);
      intPart = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
    }
    numFormatted = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
  } else {
    // International 3-digit comma format
    numFormatted = abs.toLocaleString(info.locale || "en-US", {
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: maxDigits,
    });
  }

  const symbol = showSymbol ? info.symbol : "";
  const result = showSymbol
    ? (info.code === "EUR" ? `${numFormatted} ${symbol}` : `${symbol}${numFormatted}`)
    : numFormatted;
  return isNeg ? `-${result}` : result;
}

/**
 * Compact currency abbreviations:
 * - INR: ₹15.5 K, ₹25.0 L (Lakhs), ₹1.50 Cr (Crores)
 * - International: $15.5K, $25.0M, $1.50B
 */
export function formatCompactCurrency(val: number, currencyCode: string = "USD"): string {
  const isNeg = val < 0;
  const abs = Math.abs(val);
  const info = getCurrencyInfo(currencyCode);
  const symbol = info.symbol;

  let formatted = "";
  if (info.code === "INR") {
    if (abs >= 1e7) {
      formatted = `${symbol}${(abs / 1e7).toFixed(2)} Cr`;
    } else if (abs >= 1e5) {
      formatted = `${symbol}${(abs / 1e5).toFixed(2)} L`;
    } else if (abs >= 1e3) {
      formatted = `${symbol}${(abs / 1e3).toFixed(1)} K`;
    } else {
      formatted = `${symbol}${Math.round(abs)}`;
    }
  } else {
    if (abs >= 1e9) {
      formatted = `${symbol}${(abs / 1e9).toFixed(2)}B`;
    } else if (abs >= 1e6) {
      formatted = `${symbol}${(abs / 1e6).toFixed(2)}M`;
    } else if (abs >= 1e3) {
      formatted = `${symbol}${(abs / 1e3).toFixed(1)}K`;
    } else {
      formatted = `${symbol}${Math.round(abs)}`;
    }
  }

  return isNeg ? `-${formatted}` : formatted;
}

/**
 * Formats user input strings dynamically with commas while typing.
 */
export function formatNumberWithCurrency(numStr: string, currencyCode: string = "USD"): string {
  if (!numStr) return "";
  const isNeg = numStr.startsWith("-");
  const clean = numStr.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  let intPart = parts[0];

  if (currencyCode.toUpperCase() === "INR") {
    if (intPart.length > 3) {
      const last3 = intPart.substring(intPart.length - 3);
      const rest = intPart.substring(0, intPart.length - 3);
      intPart = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
    }
  } else {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const result = parts.length > 1 ? `${intPart}.${parts[1].slice(0, 4)}` : intPart;
  return isNeg ? `-${result}` : result;
}

/**
 * Custom React hook for subscribing to and updating global currency preference.
 */
export function useCurrency(defaultCode?: string) {
  const [currency, setCurrencyState] = useState<string>(() => defaultCode || "USD");

  useEffect(() => {
    const initial = defaultCode || getStoredCurrency();
    setCurrencyState(initial);

    const handleCurrencyChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "string") {
        setCurrencyState(detail);
      }
    };

    window.addEventListener("theutilify:currency-change", handleCurrencyChange);
    return () => window.removeEventListener("theutilify:currency-change", handleCurrencyChange);
  }, [defaultCode]);

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(code);
    setStoredCurrency(code);
  }, []);

  return {
    currency,
    setCurrency,
    info: getCurrencyInfo(currency),
    format: (val: number, options?: { maximumFractionDigits?: number; showSymbol?: boolean }) =>
      formatCurrencyValue(val, currency, options),
    formatCompact: (val: number) => formatCompactCurrency(val, currency),
    formatInput: (numStr: string) => formatNumberWithCurrency(numStr, currency),
  };
}
