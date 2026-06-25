import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardPageSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Page title */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 pb-px mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-t-lg" />
          ))}
        </div>

        {/* Rows */}
        <DashboardPageSkeleton rows={5} title={false} />
      </div>
    </DashboardLayout>
  );
}
