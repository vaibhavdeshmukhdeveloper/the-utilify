"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Smartphone, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getLanguageFromPathname } from "@/lib/i18n/translations";
import { getUIStrings } from "@/lib/i18n/ui-strings";

interface AppPromoDetails {
  name: string;
  description: string;
  url: string;
  features: string[];
}

export function CrossPromo() {
  const pathname = usePathname();
  const currentLang = getLanguageFromPathname(pathname);
  const t = getUIStrings(currentLang);

  const getPromoDetails = (): AppPromoDetails => {
    // Spanish Promos
    if (currentLang === "es") {
      if (pathname?.includes("pdf") || pathname?.includes("bank-statement") || pathname?.includes("invoice") || pathname?.includes("contract")) {
        return {
          name: "PDF Merge Split Convert",
          description: "Une, divide y extrae páginas de documentos PDF de forma segura y 100% sin conexión desde tu teléfono.",
          url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
          features: [
            "100% Sin Conexión: Procesa PDFs confidenciales sin subirlos a internet",
            "Ultra Rápido: Ejecución instantánea en tu dispositivo Android",
            "Completamente Gratis: Sin límites de archivos ni pagos obligatorios",
          ],
        };
      }
      if (pathname?.includes("qr") || pathname?.includes("wifi")) {
        return {
          name: "QR Toolbox - Bulk Generator",
          description: "Genera códigos QR personalizados en lote y sin internet. Soporta listas CSV y estilos avanzados.",
          url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
          features: [
            "Exportación Masiva: Genera cientos de códigos QR al instante",
            "Personalización: Diseña colores, marcos e inserta logos",
            "Cero Internet: Todo se renderiza 100% offline",
          ],
        };
      }
      return {
        name: "Suite de Utilidades",
        description: "Descubre nuestra suite completa de aplicaciones de productividad seguras y offline para Android.",
        url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
        features: [
          "Ligeras: Menos de 15MB para ahorrar espacio en tu teléfono",
          "Privacidad Total: Sin permisos invasivos ni registros",
          "100% Offline: Funciona sin datos móviles ni Wi-Fi",
        ],
      };
    }

    // Portuguese Promos
    if (currentLang === "pt") {
      if (pathname?.includes("pdf") || pathname?.includes("bank-statement") || pathname?.includes("invoice") || pathname?.includes("contract")) {
        return {
          name: "PDF Merge Split Convert",
          description: "Junte, divida e extraia páginas de arquivos PDF com total segurança e offline direto do celular.",
          url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
          features: [
            "100% Offline: Processe PDFs confidenciais sem envio para a internet",
            "Ultra Rápido: Execução instantânea no seu aparelho Android",
            "Totalmente Gratuito: Sem limites de arquivos ou assinaturas",
          ],
        };
      }
      if (pathname?.includes("qr") || pathname?.includes("wifi")) {
        return {
          name: "QR Toolbox - Bulk Generator",
          description: "Crie códigos QR em lote e offline com personalização de cores e suporte a planilhas CSV.",
          url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
          features: [
            "Geração em Lote: Exporte centenas de códigos QR na hora",
            "Design Personalizado: Escolha cores, molduras e insira sua logo",
            "Sem Internet: Funcionamento 100% offline no dispositivo",
          ],
        };
      }
      return {
        name: "Suite de Utilitários",
        description: "Conheça nossa linha completa de ferramentas seguras e offline de produtividade para Android.",
        url: "https://play.google.com/store/apps/developer?id=Vaibhav+Deshmukh",
        features: [
          "Leves: Menos de 15MB para economizar espaço de memória",
          "Privacidade Total: Sem cadastros ou rastreamentos",
          "Funcionamento Offline: Use sem depender de internet",
        ],
      };
    }

    // Default English
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
          <Smartphone className="h-3.5 w-3.5" /> {t.crossPromo.badge}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
          {currentLang === "es" ? `Obtén ${promo.name} para Android` : currentLang === "pt" ? `Baixe ${promo.name} para Android` : `Get ${promo.name} for Android`}
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
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 leading-none mb-0.5">{t.crossPromo.getItOn}</span>
            <span className="text-sm font-black leading-none">{t.crossPromo.googlePlay}</span>
          </div>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </Card>
  );
}
