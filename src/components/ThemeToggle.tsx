"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="Toggle theme"
      className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
      type="button"
      onClick={() =>
        setTheme(mounted && resolvedTheme === "dark" ? "light" : "dark")
      }
    >
      <span className="material-symbols-outlined text-[18px]">contrast</span>
    </button>
  );
}
