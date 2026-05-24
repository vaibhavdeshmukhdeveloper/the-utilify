"use client";

import { useEffect, useRef } from "react";

export function AdBanner() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Prevent duplicate pushes during dev fast-refresh or react strict mounts
        if (!initialized.current) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (err) {
        console.error("AdSense initialization error: ", err);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mt-8 flex flex-col items-center justify-center overflow-hidden min-h-[120px] border border-dashed border-zinc-200 dark:border-zinc-800 bg-muted/10 rounded-[1.5rem] p-6 mx-auto">
      {/* Policy Compliant Label */}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 select-none">
        Advertisement
      </span>
      
      {/* Responsive Display Ad Unit */}
      <div className="w-full flex items-center justify-center min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minWidth: "250px", textAlign: "center" }}
          data-ad-client="ca-pub-6366007730203648"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
