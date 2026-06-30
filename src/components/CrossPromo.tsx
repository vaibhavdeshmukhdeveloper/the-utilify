"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Smartphone, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AppPromoDetails {
  name: string;
  description: string;
  url: string;
  features: string[];
}

export function CrossPromo() {
  const pathname = usePathname();

  const getPromoDetails = (): AppPromoDetails => {
    // PDF related paths
    if (
      pathname?.includes("pdf") || 
      pathname?.includes("bank-statement") || 
      pathname?.includes("invoice") || 
      pathname?.includes("contract")
    ) {
      return {
        name: "PDF Merge Split Convert",
        description: "Perform secure, offline PDF merges, splits, and page extractions right from your phone.",
        url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
        features: [
          "100% Offline: Process sensitive PDFs without internet uploads",
          "Ultra Fast: Instant processing on your local Android device",
          "Completely Free: No paywalls, no file count limitations"
        ]
      };
    }

    // QR related paths
    if (pathname?.includes("qr") || pathname?.includes("wifi")) {
      return {
        name: "QR Toolbox - Bulk Generator",
        description: "Generate styled QR codes in bulk offline. Supports CSV imports and custom design parameters.",
        url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
        features: [
          "Bulk Export: Generate hundreds of QR codes from CSV lists instantly",
          "Design Customization: Style frames, eyes, colors, and insert center logos",
          "Zero Internet Required: All barcodes are rendered completely offline"
        ]
      };
    }

    // Unit related paths
    if (pathname?.includes("unit") || pathname?.includes("metric") || pathname?.includes("imperial")) {
      return {
        name: "Modern Unit Currency Converter",
        description: "Translate length, weights, volumes, and live currency exchange rates on a clean offline interface.",
        url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
        features: [
          "Real-time Currency: Access live updated rates alongside offline conversions",
          "Clean Material UI: Sleek, lightweight layout optimized for quick calculations",
          "Ad-Free Options: Zero clutter or persistent pop-up alerts while converting"
        ]
      };
    }

    // Fallback/General
    return {
      name: "Vaibhav Deshmukh Utilities Suite",
      description: "Explore our full range of secure, offline productivity and utility applications for Android.",
      url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
      features: [
        "Lightweight: Apps under 15MB to save local device storage",
        "Privacy-First: Zero tracking permissions or mandatory signups",
        "Offline Ready: Work without active cellular or Wi-Fi data plans"
      ]
    };
  };

  const promo = getPromoDetails();

  return (
    <Card className="w-full mt-10 p-6 md:p-8 border-2 border-primary/20 bg-primary/5 rounded-[2rem] text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-primary/5">
      <div className="flex-1 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
          <Smartphone className="h-3.5 w-3.5" /> Mobile Companion App
        </div>
        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
          Get {promo.name} for Android
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl">
          {promo.description}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {promo.features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="shrink-0 flex flex-col items-center md:items-end justify-center w-full md:w-auto">
        <a
          href={promo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group font-black text-sm tracking-wide"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M5 3.25c-.28 0-.53.15-.66.39L12.56 12l-8.22 8.36c.13.24.38.39.66.39.12 0 .23-.03.34-.09l13.11-7.53c.69-.4 1.05-1.07 1.05-1.63 0-.56-.36-1.23-1.05-1.63L5.34 3.34c-.11-.06-.22-.09-.34-.09z"/>
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 leading-none mb-0.5">Get it on</span>
            <span className="text-sm font-black leading-none">Google Play</span>
          </div>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </Card>
  );
}
