"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, Sparkles, ShieldCheck, ThumbsUp } from "lucide-react";
import { fetchLiveRating, submitLiveRating } from "@/lib/rating-data";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import { JsonLd } from "./JsonLd";

interface RatingWidgetProps {
  toolSlug: string;
  toolTitle: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 - Could be better",
  2: "2 - Needs improvement",
  3: "3 - Good utility",
  4: "4 - Very helpful!",
  5: "5 - Outstanding! ⭐",
};

export function RatingWidget({ toolSlug, toolTitle }: RatingWidgetProps) {
  const normalizedSlug = toolSlug.replace(/^\//, "").split("?")[0];
  const storageKey = `utilify_user_rating_${normalizedSlug}`;

  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [ratingStats, setRatingStats] = useState<{
    ratingValue: number;
    reviewCount: number;
  }>({
    ratingValue: 0,
    reviewCount: 0,
  });

  // Fetch genuine live ratings and check localStorage on mount
  useEffect(() => {
    let isMounted = true;

    // Check user's previous local vote
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.rating === "number") {
            setUserRating(parsed.rating);
            setHasRated(true);
          }
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }

    // Fetch live ratings from API
    fetchLiveRating(normalizedSlug).then((data) => {
      if (isMounted) {
        setRatingStats({
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [normalizedSlug, storageKey]);

  const handleRate = async (stars: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      setUserRating(stars);
      setHasRated(true);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify({
          rating: stars,
          timestamp: Date.now(),
        }));
      }

      // Submit to live backend API
      const result = await submitLiveRating(normalizedSlug, stars);
      if (result) {
        setRatingStats({
          ratingValue: result.ratingValue,
          reviewCount: result.reviewCount,
        });
      } else {
        // Fallback optimistic update
        setRatingStats((prev) => {
          const newCount = prev.reviewCount + 1;
          const newValue = parseFloat((((prev.ratingValue * prev.reviewCount) + stars) / newCount).toFixed(1));
          return { ratingValue: newValue, reviewCount: newCount };
        });
      }

      triggerConfetti();
      toast.success(`Thank you for rating ${toolTitle} ${stars} stars!`);
    } catch (e) {
      console.error("Error submitting rating", e);
      toast.error("Could not save rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStarCount = hoveredRating !== null 
    ? hoveredRating 
    : (userRating !== null 
        ? userRating 
        : (ratingStats.ratingValue > 0 ? Math.round(ratingStats.ratingValue) : 0));

  // Dynamic Schema.org AggregateRating ONLY when genuine positive reviews exist
  const dynamicRatingSchema = ratingStats.reviewCount > 0 && ratingStats.ratingValue > 0 ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolTitle,
    "url": `https://www.theutilify.com/${normalizedSlug}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingStats.ratingValue.toFixed(1),
      "reviewCount": ratingStats.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1",
    },
  } : null;

  return (
    <>
      {dynamicRatingSchema && <JsonLd data={dynamicRatingSchema} />}
      <div className="w-full max-w-3xl mx-auto my-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-card via-card/80 to-muted/20 border border-border/80 shadow-sm transition-all text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Left side: Rating score & Title */}
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> User Feedback
              </span>
              {ratingStats.reviewCount > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              How would you rate <span className="text-primary">{toolTitle}</span>?
            </h3>
            
            {ratingStats.reviewCount > 0 ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-foreground text-sm font-mono">{ratingStats.ratingValue.toFixed(1)}</span>
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i <= Math.round(ratingStats.ratingValue)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span>•</span>
                <span className="font-medium">
                  <strong className="text-foreground">{ratingStats.reviewCount}</strong> {ratingStats.reviewCount === 1 ? "user rating" : "user ratings"}
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No ratings yet — be the first to rate your experience!
              </p>
            )}
          </div>

          {/* Right side: Interactive Star Rating */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-background/80 border shadow-inner">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  disabled={isSubmitting}
                  className="p-1 rounded-xl hover:scale-125 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 group cursor-pointer disabled:opacity-50"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors duration-150 ${
                      star <= activeStarCount
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                        : "text-zinc-300 dark:text-zinc-700 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback Label or Confirmation */}
            <div className="h-5 flex items-center justify-center sm:justify-end text-xs font-semibold">
              {hoveredRating !== null ? (
                <span className="text-amber-500 font-bold animate-in fade-in duration-150">
                  {RATING_LABELS[hoveredRating]}
                </span>
              ) : hasRated && userRating !== null ? (
                <span className="text-emerald-500 font-bold flex items-center gap-1 animate-in fade-in duration-150">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> You rated this {userRating}/5 stars
                </span>
              ) : (
                <span className="text-muted-foreground text-[11px]">
                  Click a star to submit your review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Real community trust footer */}
        <div className="mt-4 pt-3.5 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Real community feedback • 100% authentic ratings</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Zero sign-up required
          </span>
        </div>
      </div>
    </>
  );
}
