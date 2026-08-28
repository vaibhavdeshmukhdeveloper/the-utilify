"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { triggerConfetti } from "@/lib/confetti";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  title?: string;
  disabled?: boolean;
}

export function CopyButton({
  value,
  label,
  className,
  variant = "ghost",
  size = "sm",
  title = "Copy to clipboard",
  disabled = false
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      triggerConfetti();
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      variant={isCopied ? "outline" : variant}
      size={size}
      title={title}
      disabled={disabled}
      className={cn(
        "relative transition-all active:scale-95 duration-200 font-bold rounded-xl flex items-center justify-center gap-1.5",
        isCopied && "border-green-500 text-green-600 bg-green-500/5 hover:bg-green-500/10 hover:text-green-600 dark:border-green-500 dark:text-green-500 dark:bg-green-500/5",
        className
      )}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4 animate-in zoom-in duration-200" />
          {label && <span>Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label && <span>{label}</span>}
        </>
      )}
    </Button>
  );
}
