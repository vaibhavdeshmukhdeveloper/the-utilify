"use client";

import React, { useState, useRef, useEffect } from "react";
import { TrendingUp, DollarSign } from "lucide-react";

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

// ----------------------------------------------------
// 1. DONUT CHART COMPONENT (Invested vs. Wealth Gain)
// ----------------------------------------------------
export function DonutChart({ 
  invested, 
  returns 
}: { 
  invested: number; 
  returns: number; 
}) {
  const total = invested + returns;
  const investedPct = total > 0 ? (invested / total) * 100 : 50;
  const returnsPct = total > 0 ? (returns / total) * 100 : 50;

  const [hovered, setHovered] = useState<"none" | "invested" | "returns">("none");

  // SVG dimensions
  const size = 180;
  const strokeWidth = 18;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius; // ~446

  // Stroke offsets
  const investedOffset = circ - (circ * investedPct) / 100;
  const returnsOffset = circ - (circ * returnsPct) / 100;

  // Rotations so segments align nicely (Invested starts at top, Returns follows)
  const rotationInvested = -90;
  const rotationReturns = -90 + (investedPct * 3.6);

  const formatCurrency = (val: number) => {
    return "$" + Math.round(val).toLocaleString("en-US");
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 justify-center p-6 bg-card border border-border/80 rounded-[2.5rem] shadow-sm">
      {/* SVG Container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            className="opacity-20"
            strokeWidth={strokeWidth}
          />
          {/* Invested Capital segment */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--primary)"
            strokeWidth={strokeWidth + (hovered === "invested" ? 3 : 0)}
            strokeDasharray={circ}
            strokeDashoffset={investedOffset}
            transform={`rotate(${rotationInvested} ${center} ${center})`}
            strokeLinecap="round"
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHovered("invested")}
            onMouseLeave={() => setHovered("none")}
          />
          {/* Wealth Gain segment */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#22c55e"
            strokeWidth={strokeWidth + (hovered === "returns" ? 3 : 0)}
            strokeDasharray={circ}
            strokeDashoffset={returnsOffset}
            transform={`rotate(${rotationReturns} ${center} ${center})`}
            strokeLinecap="round"
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHovered("returns")}
            onMouseLeave={() => setHovered("none")}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none select-none">
          {hovered === "none" ? (
            <>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Value</span>
              <span className="text-xl font-black tracking-tight text-foreground mt-0.5">{formatCurrency(total)}</span>
            </>
          ) : hovered === "invested" ? (
            <>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Invested</span>
              <span className="text-xl font-black tracking-tight text-foreground mt-0.5">{formatCurrency(invested)}</span>
              <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{Math.round(investedPct)}%</span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Wealth Gain</span>
              <span className="text-xl font-black tracking-tight text-foreground mt-0.5">{formatCurrency(returns)}</span>
              <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{Math.round(returnsPct)}%</span>
            </>
          )}
        </div>
      </div>

      {/* Legend Column */}
      <div className="flex flex-col gap-4 text-left">
        <h4 className="font-bold text-foreground text-sm uppercase tracking-widest text-muted-foreground">Breakdown</h4>
        
        {/* Principal Legend Item */}
        <div 
          className={`flex items-start gap-3 p-3 rounded-2xl transition-colors select-none ${
            hovered === "invested" ? "bg-muted/80 border border-primary/20" : "border border-transparent"
          }`}
          onMouseEnter={() => setHovered("invested")}
          onMouseLeave={() => setHovered("none")}
        >
          <div className="w-4 h-4 rounded bg-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Invested Capital</div>
            <div className="text-base font-bold text-foreground">{formatCurrency(invested)}</div>
            <div className="text-xs font-semibold text-muted-foreground">{Math.round(investedPct)}% of total</div>
          </div>
        </div>

        {/* Wealth Gain Legend Item */}
        <div 
          className={`flex items-start gap-3 p-3 rounded-2xl transition-colors select-none ${
            hovered === "returns" ? "bg-muted/80 border border-green-500/20" : "border border-transparent"
          }`}
          onMouseEnter={() => setHovered("returns")}
          onMouseLeave={() => setHovered("none")}
        >
          <div className="w-4 h-4 rounded bg-green-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Est. Wealth Gain</div>
            <div className="text-base font-bold text-green-500">{formatCurrency(returns)}</div>
            <div className="text-xs font-semibold text-muted-foreground">{Math.round(returnsPct)}% of total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. AREA GROWTH CHART COMPONENT (Progression Curve)
// ----------------------------------------------------
export function GrowthChart({ 
  breakdown 
}: { 
  breakdown: YearlyBreakdown[];
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!breakdown || breakdown.length === 0) return null;

  const totalYears = breakdown.length;
  const lastItem = breakdown[totalYears - 1];
  const maxVal = lastItem.balance || 1;

  // Chart dimensions inside the viewBox
  const width = 500;
  const height = 240;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert year statistics to SVG coordinates
  const getCoordinates = (index: number, val: number) => {
    const x = paddingLeft + (index / (totalYears > 1 ? totalYears - 1 : 1)) * chartWidth;
    const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
    return { x, y };
  };

  // Compile path commands for both lines & areas
  let balancePoints = "";
  let principalPoints = "";
  
  breakdown.forEach((item, idx) => {
    const balCoord = getCoordinates(idx, item.balance);
    const prinCoord = getCoordinates(idx, item.principal);
    
    if (idx === 0) {
      balancePoints += `M ${balCoord.x} ${balCoord.y}`;
      principalPoints += `M ${prinCoord.x} ${prinCoord.y}`;
    } else {
      balancePoints += ` L ${balCoord.x} ${balCoord.y}`;
      principalPoints += ` L ${prinCoord.x} ${prinCoord.y}`;
    }
  });

  // Close areas down to bottom
  const startX = getCoordinates(0, 0).x;
  const endX = getCoordinates(totalYears - 1, 0).x;
  const bottomY = paddingTop + chartHeight;

  const balanceAreaPath = totalYears > 0 
    ? `${balancePoints} L ${endX} ${bottomY} L ${startX} ${bottomY} Z` 
    : "";
  
  const principalAreaPath = totalYears > 0 
    ? `${principalPoints} L ${endX} ${bottomY} L ${startX} ${bottomY} Z` 
    : "";

  // Grid lines calculation
  const gridLines = [0.25, 0.5, 0.75, 1];

  const formatCurrencyAbbrev = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
    return `$${Math.round(val)}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Percentage relative to graph width
    const pct = (mouseX - (paddingLeft / width) * rect.width) / ((chartWidth / width) * rect.width);
    const hoverIdx = Math.max(0, Math.min(totalYears - 1, Math.round(pct * (totalYears - 1))));
    setActiveIdx(hoverIdx);
  };

  const activeData = activeIdx !== null ? breakdown[activeIdx] : null;
  const activeBalCoord = activeIdx !== null && activeData ? getCoordinates(activeIdx, activeData.balance) : null;
  const activePrinCoord = activeIdx !== null && activeData ? getCoordinates(activeIdx, activeData.principal) : null;

  return (
    <div ref={containerRef} className="flex flex-col gap-6 p-6 bg-card border border-border/80 rounded-[2.5rem] shadow-sm w-full relative">
      <div className="flex justify-between items-center px-2">
        <h4 className="font-bold text-foreground text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="h-4.5 w-4.5 text-primary" /> Growth Over Time
        </h4>
        <span className="text-[11px] font-black text-muted-foreground uppercase">
          {totalYears} Year Projection
        </span>
      </div>

      <div className="relative">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          className="overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveIdx(null)}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="prinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines and axis tags */}
          {gridLines.map((ratio, index) => {
            const gridY = paddingTop + chartHeight - ratio * chartHeight;
            const gridVal = ratio * maxVal;
            return (
              <g key={index} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={gridY}
                  x2={width - paddingRight}
                  y2={gridY}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={gridY + 4}
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  className="font-mono text-[9px] font-bold"
                >
                  {formatCurrencyAbbrev(gridVal)}
                </text>
              </g>
            );
          })}

          {/* Year X labels */}
          {breakdown.length > 0 && [0, Math.floor((totalYears - 1) / 2), totalYears - 1].map((yearIdx) => {
            if (yearIdx >= totalYears) return null;
            const yearItem = breakdown[yearIdx];
            const coord = getCoordinates(yearIdx, 0);
            return (
              <text
                key={yearIdx}
                x={coord.x}
                y={height - 8}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                className="font-black text-[10px] uppercase tracking-wider"
              >
                Year {yearItem.year}
              </text>
            );
          })}

          {/* Solid fill shapes under curve */}
          {totalYears > 1 && (
            <>
              <path d={balanceAreaPath} fill="url(#balGrad)" />
              <path d={principalAreaPath} fill="url(#prinGrad)" />
            </>
          )}

          {/* Stroke curves */}
          {totalYears > 1 && (
            <>
              <path
                d={principalPoints}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={balancePoints}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Active tooltip marker lines */}
          {activeIdx !== null && activeBalCoord && activePrinCoord && (
            <g className="animate-in fade-in duration-200">
              <line
                x1={activeBalCoord.x}
                y1={paddingTop}
                x2={activeBalCoord.x}
                y2={paddingTop + chartHeight}
                stroke="var(--primary)"
                strokeDasharray="2 2"
                strokeWidth="1.5"
                className="opacity-50"
              />
              {/* Glow indicators for points */}
              <circle
                cx={activePrinCoord.x}
                cy={activePrinCoord.y}
                r="6"
                fill="var(--primary)"
                className="opacity-30"
              />
              <circle
                cx={activePrinCoord.x}
                cy={activePrinCoord.y}
                r="3.5"
                fill="var(--primary)"
                stroke="#fff"
                strokeWidth="1.5"
              />
              
              <circle
                cx={activeBalCoord.x}
                cy={activeBalCoord.y}
                r="6"
                fill="#22c55e"
                className="opacity-30"
              />
              <circle
                cx={activeBalCoord.x}
                cy={activeBalCoord.y}
                r="3.5"
                fill="#22c55e"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Dynamic Tooltip overlay box */}
        {activeIdx !== null && activeData && (
          <div className="absolute top-2 left-[65px] right-2 bg-zinc-950/90 dark:bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-3 shadow-xl backdrop-blur-md grid grid-cols-3 gap-2 text-left pointer-events-none animate-in fade-in slide-in-from-top-1 duration-150">
            <div>
              <div className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Timeline</div>
              <div className="text-sm font-black">Year {activeData.year}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-primary tracking-wider">Invested</div>
              <div className="text-sm font-bold">${Math.round(activeData.principal).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-green-400 tracking-wider">Maturity</div>
              <div className="text-sm font-black text-green-400">${Math.round(activeData.balance).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
