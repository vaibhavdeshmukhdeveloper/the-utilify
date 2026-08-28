"use client";

import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
  popular?: boolean;
  isPinned?: boolean;
  onTogglePin?: (e: React.MouseEvent, href: string) => void;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  category,
  popular,
  isPinned = false,
  onTogglePin,
}: ToolCardProps) {
  return (
    <Link href={href} className="block h-full group select-none">
      <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 border border-zinc-200 dark:border-zinc-800 bg-card/60 backdrop-blur-md rounded-3xl flex flex-col justify-between">
        {/* Top Badges & Favorite Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {popular && (
            <div className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Popular
            </div>
          )}
          {onTogglePin && (
            <button
              type="button"
              onClick={(e) => onTogglePin(e, href)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                isPinned
                  ? "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25"
                  : "bg-muted/60 text-muted-foreground hover:text-amber-500 hover:bg-muted opacity-60 hover:opacity-100 group-hover:opacity-100"
              )}
              title={isPinned ? "Unpin tool" : "Pin to favorites"}
            >
              <Star className={cn("h-4 w-4", isPinned && "fill-amber-500")} />
            </button>
          )}
        </div>

        <CardHeader className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {category}
            </span>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
          <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-2 text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        {/* Hover Highlight Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </Link>
  );
}
