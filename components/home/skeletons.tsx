/**
 * Skeleton loading states for homepage sections.
 * Used with React Suspense boundaries.
 */

function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`animate-shimmer overflow-hidden rounded bg-gray-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm" aria-hidden="true">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shimmer className="h-11 w-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3.5 w-24 rounded-full" />
          <Shimmer className="h-3 w-16 rounded-full" />
        </div>
      </div>
      {/* Title */}
      <Shimmer className="mt-4 h-4 w-full rounded-full" />
      <Shimmer className="mt-1.5 h-4 w-3/4 rounded-full" />
      {/* Tags */}
      <div className="mt-3 flex gap-2">
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-20 rounded-full" />
      </div>
      {/* Meta */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <Shimmer className="h-2.5 w-12 rounded-full" />
            <Shimmer className="h-4 w-20 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-16 rounded-full" />
            <Shimmer className="h-3 w-12 rounded-full" />
          </div>
        </div>
        <Shimmer className="mt-3 h-3 w-24 rounded-full" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Shimmer className="h-9 rounded-xl" />
          <Shimmer className="h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OpportunityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading opportunities…" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading opportunities…</span>
    </div>
  );
}

export function BrandCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Shimmer className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3.5 w-28 rounded-full" />
          <Shimmer className="h-3 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <Shimmer className="h-3 w-28 rounded-full" />
        <Shimmer className="h-5 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function BrandGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" aria-label="Loading brands…" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <BrandCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading brands…</span>
    </div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm" aria-hidden="true">
      <Shimmer className="h-16 w-16 rounded-full" />
      <Shimmer className="mt-3 h-3.5 w-24 rounded-full" />
      <Shimmer className="mt-1 h-3 w-16 rounded-full" />
      <Shimmer className="mt-2 h-3.5 w-20 rounded-full" />
      <div className="mt-2 flex gap-1.5">
        <Shimmer className="h-5 w-5 rounded-full" />
        <Shimmer className="h-5 w-5 rounded-full" />
        <Shimmer className="h-5 w-5 rounded-full" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <Shimmer className="h-4 w-14 rounded-full" />
        <Shimmer className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function CreatorGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6" aria-label="Loading creators…" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <CreatorCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading creators…</span>
    </div>
  );
}

export function ActivitySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading activity…" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3.5" aria-hidden="true">
          <Shimmer className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3.5 w-40 rounded-full" />
            <Shimmer className="h-3 w-56 rounded-full" />
          </div>
          <Shimmer className="h-3 w-12 rounded-full" />
        </div>
      ))}
      <span className="sr-only">Loading activity…</span>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="rounded-2xl bg-gray-100 p-5" aria-hidden="true">
      <Shimmer className="h-8 w-8 rounded-lg" />
      <Shimmer className="mt-3 h-3.5 w-24 rounded-full" />
      <Shimmer className="mt-1.5 h-3 w-14 rounded-full" />
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6" aria-label="Loading categories…" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
      <span className="sr-only">Loading categories…</span>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4" aria-label="Loading statistics…" role="status">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3" aria-hidden="true">
          <Shimmer className="h-12 w-12 rounded-2xl" />
          <Shimmer className="h-10 w-24 rounded-full" />
          <Shimmer className="h-3 w-32 rounded-full" />
        </div>
      ))}
      <span className="sr-only">Loading statistics…</span>
    </div>
  );
}
