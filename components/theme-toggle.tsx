"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useAppState } from "@/components/app-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useAppState();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-2 text-sm text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-surface-soft",
        compact && "h-10 w-10 justify-center px-0"
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Ganti mode tema"
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      {!compact ? <span>{isDark ? "Mode terang" : "Mode gelap"}</span> : null}
    </button>
  );
}
