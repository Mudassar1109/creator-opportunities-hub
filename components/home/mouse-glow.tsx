"use client";

import { useEffect, useRef } from "react";

/**
 * MouseGlow — follows cursor with a soft radial glow effect.
 * Only renders on desktop (pointer: fine). Zero-cost on mobile.
 * Uses CSS custom properties to avoid React re-renders on every mousemove.
 */
export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on pointer:fine devices (mouse, not touch)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let raf: number;

    function onMove(e: MouseEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el!.style.setProperty("--gx", `${e.clientX}px`);
        el!.style.setProperty("--gy", `${e.clientY}px`);
        el!.style.opacity = "1";
      });
    }

    function onLeave() {
      el!.style.opacity = "0";
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="mouse-glow pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-500"
      aria-hidden="true"
      style={
        {
          "--gx": "-999px",
          "--gy": "-999px",
          background:
            "radial-gradient(600px circle at var(--gx) var(--gy), rgba(79, 70, 229, 0.06), transparent 60%)",
        } as React.CSSProperties
      }
    />
  );
}
