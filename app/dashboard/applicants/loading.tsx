import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardPageSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ApplicantsLoading() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="space-y-2 mb-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <DashboardPageSkeleton rows={6} title={false} />
      </div>
    </DashboardLayout>
  );
}
