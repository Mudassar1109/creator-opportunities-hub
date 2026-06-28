export default function AdminActivityLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="h-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
