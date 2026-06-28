import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6" aria-busy="true" aria-label="Loading analytics…">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5"
          >
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Growth Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-6 w-10 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6"
          >
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="flex h-48 items-end gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="flex flex-1 flex-col items-center gap-1">
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className={`w-full rounded-t-md ${["h-1/2","h-3/5","h-2/3","h-3/4","h-4/5","h-5/6"][j % 6]}`} />
                  <Skeleton className="h-3 w-6" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6"
          >
            <Skeleton className="h-5 w-28 mb-1" />
            <Skeleton className="h-4 w-40 mb-4" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 mb-3">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
