"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface BlogShareBarProps {
  title: string;
  slug: string;
}

export function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const articleUrl = `https://www.theutilify.com/blog/${slug}`;

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href || articleUrl);
        setCopied(true);
        toast.success("Article link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${title}" via @theutilify\n`);
    const url = encodeURIComponent(articleUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(articleUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-muted-foreground my-8">
      <div className="flex items-center gap-2 text-foreground font-bold">
        <Share2 className="h-4 w-4 text-primary" />
        <span>Share this guide:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
            copied
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
              : "bg-card border-zinc-200 dark:border-zinc-800 hover:text-primary hover:border-primary/40 text-foreground"
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* Twitter / X */}
        <button
          onClick={handleShareTwitter}
          className="px-3 py-1.5 rounded-xl border bg-card border-zinc-200 dark:border-zinc-800 hover:text-primary hover:border-primary/40 text-foreground transition-all cursor-pointer font-bold"
        >
          X (Twitter)
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleShareLinkedIn}
          className="px-3 py-1.5 rounded-xl border bg-card border-zinc-200 dark:border-zinc-800 hover:text-primary hover:border-primary/40 text-foreground transition-all cursor-pointer font-bold"
        >
          LinkedIn
        </button>
      </div>
    </div>
  );
}
