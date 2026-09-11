"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { applyTheme, readTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Sun and moon swap places as you toggle. Dark is the default. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as const);
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={() => applyTheme(light ? "dark" : "light")}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full bg-bone/8 text-bone transition-colors duration-300 hover:bg-bone/14",
        className,
      )}
    >
      <Sun
        size={17}
        weight="bold"
        className={cn(
          "absolute transition-[transform,opacity] duration-500 ease-[var(--ease-out)]",
          light ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
      />
      <Moon
        size={17}
        weight="bold"
        className={cn(
          "absolute transition-[transform,opacity] duration-500 ease-[var(--ease-out)]",
          light ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100",
        )}
      />
    </button>
  );
}
