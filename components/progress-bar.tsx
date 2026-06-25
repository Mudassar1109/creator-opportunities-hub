"use client";

/**
 * TopProgressBar — YouTube/Vercel-style loading bar.
 * Fires on every route change using Next.js navigation events.
 * Zero dependencies, pure CSS animation.
 */

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const start = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Clear any in-flight timer
    if (timerRef.current) clearTimeout(timerRef.current);
    // Reset then animate to ~80%
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    // Allow reset to paint, then start
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = "width 400ms cubic-bezier(0.4,0,0.2,1)";
        bar.style.width = "70%";
      });
    });
  }, []);

  const finish = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = "width 200ms ease-out, opacity 300ms ease 200ms";
    bar.style.width = "100%";
    timerRef.current = setTimeout(() => {
      if (barRef.current) barRef.current.style.opacity = "0";
    }, 400);
  }, []);

  // Trigger on every pathname/searchParams change
  useEffect(() => {
    start();
    // Small delay to let Server Component start fetching, then complete
    const t = setTimeout(finish, 120);
    return () => clearTimeout(t);
  }, [pathname, searchParams, start, finish]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-0 opacity-0"
      ref={barRef}
      style={{
        background: "linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4)",
        boxShadow: "0 0 10px rgba(124, 58, 237, 0.7), 0 0 5px rgba(6, 182, 212, 0.5)",
      }}
    >
      {/* Glow tip */}
      <div
        className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
        style={{
          background: "rgba(124, 58, 237, 0.9)",
          boxShadow: "0 0 8px 3px rgba(124, 58, 237, 0.6)",
        }}
      />
    </div>
  );
}
