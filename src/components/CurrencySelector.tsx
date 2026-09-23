"use client";

import React, { useState, useRef, useEffect } from "react";
import { POPULAR_CURRENCIES, getCurrencyInfo, detectClientCurrency } from "@/lib/currency";
import { Search, ChevronDown, Check, Globe, Sparkles } from "lucide-react";

interface CurrencySelectorProps {
  value: string;
  onChange: (currencyCode: string) => void;
  className?: string;
  size?: "sm" | "default";
}

export function CurrencySelector({
  value,
  onChange,
  className = "",
  size = "default",
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeInfo = getCurrencyInfo(value);
  const detectedCode = typeof window !== "undefined" ? detectClientCurrency() : "USD";

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter currencies
  const query = search.trim().toLowerCase();
  const filteredCurrencies = POPULAR_CURRENCIES.filter((c) => {
    if (!query) return true;
    return (
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query)
    );
  });

  const popularQuickList = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-xl font-bold border transition-all cursor-pointer shadow-xs ${
          size === "sm"
            ? "px-2.5 py-1 text-xs h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-foreground"
            : "px-3 py-1.5 text-xs sm:text-sm h-9 sm:h-10 bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800 border-border text-foreground"
        }`}
        title="Change currency"
      >
        <span className="text-base leading-none">{activeInfo.flag}</span>
        <span className="font-extrabold tracking-tight">{activeInfo.code}</span>
        <span className="text-muted-foreground font-mono text-xs">({activeInfo.symbol})</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 space-y-2.5 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-primary" /> Select Currency
              </span>
              {detectedCode !== value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(detectedCode);
                    setIsOpen(false);
                  }}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  title={`Detected for your region: ${detectedCode}`}
                >
                  <Sparkles className="h-3 w-3" /> Auto ({detectedCode})
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code or country..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-hidden focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Popular quick chips */}
            {!query && (
              <div className="flex flex-wrap gap-1 pt-1">
                {popularQuickList.map((code) => {
                  const item = getCurrencyInfo(code);
                  const isSelected = item.code === activeInfo.code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChange(code);
                        setIsOpen(false);
                      }}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-foreground"
                      }`}
                    >
                      {item.code} {item.symbol}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Currency List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredCurrencies.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No currencies found matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredCurrencies.map((c) => {
                const isSelected = c.code === activeInfo.code;
                const isDetected = c.code === detectedCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none shrink-0">{c.flag}</span>
                      <div className="truncate">
                        <span className="font-extrabold mr-1.5">{c.code}</span>
                        <span className="text-muted-foreground truncate">{c.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isDetected && !isSelected && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-muted-foreground font-semibold">
                          Local
                        </span>
                      )}
                      <span className="font-mono font-bold text-zinc-500 w-7 text-right">{c.symbol}</span>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <div className="w-4" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
