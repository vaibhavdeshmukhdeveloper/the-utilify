"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  alt?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original",
  afterLabel = "Processed",
  className,
  alt = "Comparison",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleInteractionEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        if (e.touches.length > 0) handleMove(e.touches[0].clientX);
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl select-none cursor-ew-resize bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl group focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
    >
      {/* "After" / Processed Image (Full Background) */}
      <img
        src={afterImage}
        alt={`${alt} - ${afterLabel}`}
        className="block w-full h-auto max-h-[500px] object-contain pointer-events-none mx-auto"
        draggable={false}
      />

      {/* "Before" / Original Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={`${alt} - ${beforeLabel}`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none max-h-[500px]"
          draggable={false}
          style={{ width: containerRef.current?.clientWidth || "100%", maxWidth: "none" }}
        />
      </div>

      {/* Vertical Dividing Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Draggable Circle Center Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center border-2 border-primary group-hover:scale-110 transition-transform">
          <MoveHorizontal className="h-4 w-4 text-primary font-bold" />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-primary/80 backdrop-blur-md text-white border border-primary/40 shadow-md">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
