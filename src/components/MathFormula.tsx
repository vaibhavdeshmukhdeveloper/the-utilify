"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export function MathFormula({ formula, displayMode = true, className }: MathFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
      });
    } catch {
      return formula;
    }
  }, [formula, displayMode]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
