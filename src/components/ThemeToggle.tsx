"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center justify-center rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  );
}
