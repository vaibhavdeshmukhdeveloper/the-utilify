import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
  popular?: boolean;
}

export function ToolCard({ title, description, href, icon: Icon, category, popular }: ToolCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 group border-zinc-200 dark:border-zinc-800 bg-card/50 backdrop-blur-sm">
        {popular && (
          <div className="absolute top-0 right-0">
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tight">
              Popular
            </div>
          </div>
        )}
        <CardHeader className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-sm">
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              {category}
            </span>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
          <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    </Link>
  );
}
