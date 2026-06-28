import { Skeleton } from "@/components/ui/skeleton";

export default function AdminNotificationsLoading() {
  return (
    <div className="mx-auto max-w-6xl" aria-busy="true" aria-label="Loading notifications…">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-8 w-10" />
          </div>
        ))}
      </div>

      {/* Search/filter bar */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-3 w-full max-w-sm" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
