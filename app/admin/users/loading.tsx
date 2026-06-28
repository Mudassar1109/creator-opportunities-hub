import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading users…">
      <div className="mb-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-xs rounded-xl" />
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-12 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="hidden gap-2 sm:flex">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-7 w-10 rounded-lg" />
              <Skeleton className="h-7 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
