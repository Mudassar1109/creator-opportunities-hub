/**
 * ProgressBarWrapper — Server Component.
 *
 * Wraps the client-side TopProgressBar in a Suspense boundary so that
 * useSearchParams() inside TopProgressBar doesn't force the entire layout
 * into client-only rendering. This is the correct Next.js App Router pattern.
 *
 * No "use client" here — the boundary is intentionally at TopProgressBar.
 */
import { Suspense } from "react";
import { TopProgressBar } from "./progress-bar";

export function ProgressBarWrapper() {
  return (
    <Suspense fallback={null}>
      <TopProgressBar />
    </Suspense>
  );
}
