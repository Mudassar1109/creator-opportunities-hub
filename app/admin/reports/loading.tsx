import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReportsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading reports…">
      <div className="mb-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-xs rounded-xl" />
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex gap-1.5">
            <Skeleton className="h-7 w-12 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
          <div className="flex gap-1.5">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-6 w-12 rounded-lg" />
            <Skeleton className="h-6 w-14 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-[2] space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-4" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="hidden md:block">
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="hidden xl:block">
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="hidden sm:block">
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
