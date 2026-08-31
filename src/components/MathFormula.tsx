"use client";

import React, { useState, useEffect } from "react";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

// Module-level cache so KaTeX is only imported once across all formula instances
let katexInstance: any = null;

export function MathFormula({ formula, displayMode = true, className }: MathFormulaProps) {
  const [renderedHtml, setRenderedHtml] = useState<string | null>(() => {
    if (katexInstance) {
      try {
        return katexInstance.renderToString(formula, {
          displayMode,
          throwOnError: false,
        });
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    let isCancelled = false;

    if (!katexInstance) {
      import("katex").then((module) => {
        katexInstance = module.default || module;
        if (!isCancelled && katexInstance) {
          try {
            const html = katexInstance.renderToString(formula, {
              displayMode,
              throwOnError: false,
            });
            setRenderedHtml(html);
          } catch {
            setRenderedHtml(formula);
          }
        }
      }).catch(() => {
        if (!isCancelled) setRenderedHtml(formula);
      });
    } else {
      try {
        const html = katexInstance.renderToString(formula, {
          displayMode,
          throwOnError: false,
        });
        setRenderedHtml(html);
      } catch {
        setRenderedHtml(formula);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [formula, displayMode]);

  if (renderedHtml) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  // Graceful formula placeholder while KaTeX loads in background (< 50ms)
  return (
    <div className={`font-mono text-xs opacity-90 py-1 ${className || ""}`}>
      {formula}
    </div>
  );
}
