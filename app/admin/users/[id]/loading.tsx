import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUserDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading user details…">
      <Skeleton className="mb-6 h-4 w-28" />

      {/* Profile card */}
      <div className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="border-b border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
          <div className="space-y-5">
            <Skeleton className="h-4 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
          <div className="space-y-5">
            <Skeleton className="h-4 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity card */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
        <Skeleton className="mb-5 h-4 w-32" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
              <Skeleton className="mb-2 h-8 w-8 rounded-lg" />
              <Skeleton className="mb-1 h-6 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
