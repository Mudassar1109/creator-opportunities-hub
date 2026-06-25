import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardPageSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DashboardOpportunitiesLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header with create button */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Rows */}
        <DashboardPageSkeleton rows={6} title={false} />
      </div>
    </DashboardLayout>
  );
}
