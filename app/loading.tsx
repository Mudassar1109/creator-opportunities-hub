/**
 * Root loading.tsx
 *
 * Next.js App Router shows this component inside the root Suspense boundary
 * whenever a page is still streaming — on hard refresh and on slow navigations.
 * It appears instantly because it requires zero data fetching.
 *
 * Rules:
 * - No "use client" — this is a pure Server Component.
 * - No inline <style> — keyframes live in globals.css.
 * - No data dependencies — must render synchronously.
 */
export default function RootLoading() {
  return (
    <div
      className="aurora-bg fixed inset-0 z-50 flex flex-col items-center justify-center"
      aria-label="Loading CreatorHub"
      role="status"
    >
      {/* Noise texture overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* Ambient orbs */}
      <div
        className="animate-float-slow pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-medium pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Glassmorphism card */}
      <div className="glass relative flex flex-col items-center rounded-3xl px-12 py-10 shadow-2xl shadow-purple-900/40">
        {/* Logo with pulse ring */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute h-20 w-20 animate-ping rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute h-16 w-16 animate-pulse rounded-full bg-white/15"
            aria-hidden="true"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/30 to-white/10 shadow-xl backdrop-blur-sm ring-2 ring-white/20">
            <span className="text-2xl font-extrabold text-white" aria-hidden="true">
              C
            </span>
          </div>
        </div>

        {/* Brand name */}
        <p className="mt-5 text-lg font-bold tracking-tight text-white">
          Creator<span className="opacity-70">Hub</span>
        </p>

        {/* Bouncing dots — keyframe defined in globals.css */}
        <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-loading-dot h-1.5 w-1.5 rounded-full bg-white/70"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <span className="sr-only">Loading, please wait…</span>
      </div>

      <p className="mt-6 text-sm font-medium text-white/50">
        The premium creator marketplace
      </p>
    </div>
  );
}
