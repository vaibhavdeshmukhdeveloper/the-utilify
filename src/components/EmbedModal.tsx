"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { triggerConfetti } from "@/lib/confetti";
import { usePathname } from "next/navigation";
import { getLanguageFromPathname } from "@/lib/i18n/translations";

interface EmbedModalProps {
  toolSlug: string;
  toolTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EmbedModal({ toolSlug, toolTitle, isOpen, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const currentLang = getLanguageFromPathname(pathname);
  const embedUrl = `https://www.theutilify.com/embed/${toolSlug}`;

  const t = {
    modalTitle: currentLang === "es" ? `Incrustar ${toolTitle}` : currentLang === "pt" ? `Incorporar ${toolTitle}` : `Embed ${toolTitle}`,
    modalSubtitle: currentLang === "es" ? "Añade esta herramienta interactiva a tu blog, artículo o sitio web" : currentLang === "pt" ? "Adicione este utilitário interativo ao seu blog, artigo ou site" : "Add this interactive tool to your blog, article, or website",
    snippetLabel: "HTML IFRAME SNIPPET",
    copied: currentLang === "es" ? "¡Copiado!" : currentLang === "pt" ? "Copiado!" : "Copied!",
    copyCode: currentLang === "es" ? "Copiar Código" : currentLang === "pt" ? "Copiar Código" : "Copy Code",
    copySnippet: currentLang === "es" ? "Copiar Código de Inserción" : currentLang === "pt" ? "Copiar Código de Incorporação" : "Copy Embed Snippet",
    copiedToast: currentLang === "es" ? "¡Código de inserción copiado al portapapeles!" : currentLang === "pt" ? "Código copiado para a área de transferência!" : "Embed snippet copied to clipboard!",
    copyError: currentLang === "es" ? "Error al copiar código" : currentLang === "pt" ? "Erro ao copiar código" : "Failed to copy embed snippet",
    infoText: currentLang === "es" 
      ? "Este widget interactivo se ejecuta completamente del lado del cliente en un entorno aislado. Se adapta automáticamente a temas claros y oscuros."
      : currentLang === "pt"
      ? "Este widget responsivo é executado totalmente no navegador em ambiente isolado. Adapta-se automaticamente a temas claros e escuros."
      : "This responsive widget runs completely client-side in an isolated sandbox. It automatically adapts to light and dark themes on host pages.",
    openPreview: currentLang === "es" ? "Abrir Vista Previa" : currentLang === "pt" ? "Abrir Pré-visualização" : "Open Standalone Preview",
    close: currentLang === "es" ? "Cerrar" : currentLang === "pt" ? "Fechar" : "Close",
  };
  
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="650" frameborder="0" style="border-radius: 16px; border: 1px solid #e4e4e7; box-shadow: 0 4px 20px rgba(0,0,0,0.06);" title="${toolTitle} - Free Online Tool by Utilify"></iframe>
<p style="font-size: 12px; color: #71717a; text-align: right; margin-top: 6px; font-family: sans-serif;">
  Calculations powered by <a href="https://www.theutilify.com/${toolSlug}" target="_blank" rel="noopener" style="color: #6366f1; text-decoration: underline; font-weight: 600;">The Utilify</a>
</p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      triggerConfetti();
      toast.success(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.copyError);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">{t.modalTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.modalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Code Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>{t.snippetLabel}</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.copied : t.copyCode}
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed">
            {embedCode}
          </pre>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground flex items-start gap-3">
          <span className="text-base">💡</span>
          <p className="leading-relaxed">
            {t.infoText}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mr-auto"
          >
            {t.openPreview} <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </a>
          <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
            {t.close}
          </Button>
          <Button onClick={handleCopy} className="rounded-xl font-bold gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? t.copied : t.copySnippet}
          </Button>
        </div>
      </div>
    </div>
  );
}
