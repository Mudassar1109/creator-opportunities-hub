/**
 * Primitive skeleton block — single shimmer rect.
 * All route-level loading.tsx files compose from this.
 */
export function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-shimmer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full dashboard content area skeleton — used by multiple loading.tsx files */
export function DashboardPageSkeleton({ rows = 4, title = true }: { rows?: number; title?: boolean }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading…">
      {title && (
        <div className="mb-8 space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      )}
      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
      {/* Row list */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dashboard welcome banner skeleton */
export function WelcomeBannerSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
    </div>
  );
}

/** Notification list skeleton */
export function NotificationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading notifications…">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full max-w-sm" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Chat interface skeleton */
export function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" aria-busy="true" aria-label="Loading messages…">
      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r border-gray-100 dark:border-gray-800 p-4 space-y-3">
        <Skeleton className="h-9 w-full rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>
      {/* Message area */}
      <div className="flex flex-1 flex-col p-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className={`h-10 rounded-2xl ${i % 2 === 1 ? "w-48" : "w-64"}`} />
          </div>
        ))}
        <div className="mt-auto">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Profile form skeleton */
export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6" aria-busy="true" aria-label="Loading profile…">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        {/* Fields */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-11 w-28 rounded-xl" />
      </div>
    </div>
  );
}

/** Settings skeleton */
export function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6" aria-busy="true" aria-label="Loading settings…">
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-52" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Opportunities page skeleton (public) */
export function OpportunitiesPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading opportunities…">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* Filter bar */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Opportunity detail page skeleton */
export function OpportunityDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading opportunity…">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === 5 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>
    </div>
  );
}
