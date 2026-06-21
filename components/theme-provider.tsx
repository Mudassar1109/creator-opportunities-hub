"use client";

import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(stored);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("theme", t);

    const root = document.documentElement;
    if (t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  const isDark = mounted && (theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches));

  return { theme, setTheme, isDark, mounted };
}

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme, isDark, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-5 w-5 shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
        {!collapsed && <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />}
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? `Theme: ${theme}` : undefined}
    >
      <span className="shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-purple-500">
        {isDark ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        )}
      </span>
      {!collapsed && (
        <>
          <span className="truncate">
            {isDark ? "Dark mode" : "Light mode"}
          </span>
          <span className="ml-auto rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
            {theme === "system" ? "Auto" : isDark ? "D" : "L"}
          </span>
        </>
      )}
    </button>
  );
}
