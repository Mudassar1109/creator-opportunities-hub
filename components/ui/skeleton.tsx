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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading…">
      {/* Header skeleton */}
      {title && (
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="hidden h-4 w-28 sm:block" />
          </div>
        </div>
      )}
      {/* Stats row — 6 cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-7 w-10" />
          </div>
        ))}
      </div>
      {/* Two-column layout skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Section header + rows */}
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {/* Profile card skeleton */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Skeleton className="h-16 w-full rounded-none sm:h-20" />
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="-mt-8 flex flex-col items-center sm:-mt-10">
                <Skeleton className="h-16 w-16 rounded-2xl border-4 border-white dark:border-gray-900 sm:h-20 sm:w-20" />
                <div className="mt-3 space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </div>
              </div>
              <div className="mt-5 flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
              <div className="mt-4 flex justify-center gap-1.5">
                <Skeleton className="h-5 w-16 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-lg" />
              </div>
              <div className="mt-5">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
          {/* Quick actions skeletons */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
    <main className="min-h-screen bg-slate-50" aria-busy="true" aria-label="Loading opportunities…">
      <Skeleton className="h-16 w-full rounded-none" />
      {/* Hero skeleton */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Skeleton className="mb-5 h-7 w-48 rounded-full" />
          <Skeleton className="mb-3 h-12 w-[420px]" />
          <Skeleton className="h-5 w-[320px]" />
        </div>
      </div>
      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="hidden gap-3 lg:grid lg:grid-cols-6">
            <Skeleton className="h-[42px] rounded-xl" />
            <Skeleton className="h-[42px] rounded-xl" />
            <Skeleton className="h-[42px] rounded-xl" />
            <Skeleton className="h-[42px] rounded-xl" />
            <Skeleton className="h-[42px] rounded-xl" />
            <Skeleton className="h-[42px] rounded-xl" />
          </div>
          <Skeleton className="h-[42px] w-full rounded-xl lg:hidden" />
        </div>
        {/* Result count */}
        <Skeleton className="mb-5 h-4 w-40" />
        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="mt-3.5 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-3 flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="mt-4">
                <Skeleton className="mb-1 h-3 w-12" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
                <Skeleton className="h-[38px] w-[38px] rounded-xl" />
                <Skeleton className="h-[38px] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/** Opportunity detail page skeleton */
export function OpportunityDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading opportunity…">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-9 w-3/4 sm:h-10" />
              <Skeleton className="h-8 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
                <Skeleton className="h-11 w-full rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <Skeleton className="h-9 flex-1 rounded-xl" />
                </div>
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <Skeleton className="h-6 w-28" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i === 5 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
            {/* Requirements */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <Skeleton className="h-6 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            {/* Deliverables */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <Skeleton className="h-6 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
